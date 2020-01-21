const express = require("express");
const path = require("path");
const SamlStrategy = require("passport-saml").Strategy;
const passport = require("passport");
const bodyParser = require("body-parser");
const cookieSession = require("cookie-session");
// const cookieParser = require("cookie-parser");
let userEmail = "";
const app = express();
// Serve only the static files form the dist directory
app.use(express.static(__dirname + '/dist/turntabl-user-accesscontrol'));

app.use(cookieParser());
app.use(
  cookieSession({
    name: "session",
    keys: ["super secret"],
    maxAge: 2 * 24 * 60 * 60 * 1000 // 2 days
  })
);
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(passport.session());

passport.use(
  new SamlStrategy(
    {
      protocol: "https://",
      entryPoint: process.env.ENTRY_POINT, // SSO URL (Step 2)
      issuer: process.env.ISSUER, // Entity ID (Step 4)
      path: "/auth/saml/callback", // ACS URL path (Step 4)
      // cert: process.env.CERT
    },
    function (profile, done) {
      // Parse user profile data
      console.log("profile", profile);
      // console.log("assertion", profile.getAssertion.toString());
      userEmail = profile.nameID;
      return done(null, {
        email: profile.email,
        name: profile.name
      });
    }
  )
);
passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});

app.get(
  "/login",
  passport.authenticate("saml", {
    successRedirect: "/",
    failureRedirect: "/login"
  })
);

app.get("/logout", function (req, res) {
  // res.clearCookie('ttemail')
  req.logout();
  res.redirect("https://turntabl.io");
  // res.end("You have logged out.");
});

app.post(
  "/auth/saml/callback",
  bodyParser.urlencoded({ extended: false }),
  passport.authenticate("saml", {
    failureRedirect: "/error",
    failureFlash: false
  }),
  function (req, res) {
    // sets a cookie called ttemail and sets its max age to 1 day
    // res.cookie('ttemail', userEmail, { maxAge: 1 * 24 * 60 * 60 * 1000, secure: true, httpOnly: false })
    res.redirect("https://turntabl-user-accesscontrol.herokuapp.com/home");
  }
);

app.all("*", function (req, res, next) {
  if (req.isAuthenticated() || process.env.NODE_ENV !== "production") {
    next();
  } else {
    res.redirect("/login");
  }
});
app.get("/*", function (req, res) {
  res.sendFile(path.join(__dirname + "/dist/turntabl-user-accesscontrol/index.html"));
});

// Start the app by listening on the default Heroku port
app.listen(process.env.PORT || 8080);
//Importing dependencies
// const express = require('express');
// var path = require('path');

//Starting Express app
// const app = express();

//Set the base path to the angular-test dist folder
// app.use(express.static(path.join(__dirname, 'dist/UserManagementAWS')));

//Any routes will be redirected to the angular app
// app.get('*', function(req, res) {
//     res.sendFile(path.join(__dirname, 'dist/UserManagementAWS/index.html'));
// });

//Starting server on port 8081
// app.listen(8081, () => {
//     console.log('Server started!');
//     console.log('on port 8081');
// });

const SamlStrategy = require("passport-saml").Strategy;

//Install express server
const express = require("express");
const path = require("path");
const passport = require("passport");
const bodyParser = require("body-parser")
const cookieSession = require("cookie-session");
// let userEmail = process.env.ADMIN_EMAIL;

  
const app = express();

app.use(passport.initialize())
app.use(passport.session())
app.use(bodyParser.json());

app.use(
  cookieSession({
    name: "session",
    keys: ["super secret"],
    maxAge: 2 * 24 * 60 * 60 * 1000 // 2 days
  })
);


passport.use(new SamlStrategy(
    {
      protocol: "https://",
      entryPoint: process.env.ENTRY_POINT,
      issuer:     process.env.ISSUER,
      path: "/auth/saml/callback"
    //   cert: process.env.CERTIFICATE
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
  // &spid=350630521091&forceauthn=false
//   app.get("/logout", function (req, res) {
//     res.clearCookie('ttemail')
//     req.logout();
//     res.redirect("https://accounts.google.com/AccountChooser?continue=https://accounts.google.com/o/saml2/initsso?idpid%3DC00n1isy6%26spid%3D350630521091%26forceauthn%3Dfalse%26from_login%3D1%26as%3DbfUSj1vtW0E47VOaHGeZ1g&ltmpl=popup&btmpl=authsub&scc=1&oauth=1");
    // res.end("You have logged out.");
//   });

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

// Serve only the static files form the angularapp directory
app.use(express.static(__dirname + '/dist/UserManagementAWS'));

app.get('/*', function(req,res) {

res.sendFile(path.join(__dirname+'/dist/UserManagementAWS/index.html'));
});

// Start the app by listening on the default Heroku port
app.listen(process.env.PORT || 8050);
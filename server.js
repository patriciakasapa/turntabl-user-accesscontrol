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

const SamlStrategy = require('passport-saml').Strategy;

//Install express server
const express = require('express');
const path = require('path');
const passport = require("passport");

passport.use(new SamlStrategy(
    {
      path: 'https://turntabl-user-accesscontrol.herokuapp.com/',
      entryPoint: process.env.ENTRY_POINT,
      issuer: 'passport-saml'
    },
    
    function(profile, done) {
      findByEmail(profile.email, function(err) {
        userEmail = profile.nameID;
        if (err) {
          return done(err);
        }
        return done(null, {
            email: profile.email,
            name: profile.name
          });
      });
    })
  );

  passport.serializeUser(function (user, done) {
    done(null, user);
  });
  
  passport.deserializeUser(function (user, done) {
    done(null, user);
  });
  
const app = express();

app.get(
    "/https://accounts.google.com/AccountChooser?continue=https://accounts.google.com/o/saml2/initsso?idpid%3DC00n1isy6%26spid%3D350630521091%26forceauthn%3Dfalse%26from_login%3D1%26as%3DbfUSj1vtW0E47VOaHGeZ1g&ltmpl=popup&btmpl=authsub&scc=1&oauth=1",
    passport.authenticate("saml", {
      successRedirect: "/",
      failureRedirect: "https://accounts.google.com/AccountChooser?continue=https://accounts.google.com/o/saml2/initsso?idpid%3DC00n1isy6%26spid%3D350630521091%26forceauthn%3Dfalse%26from_login%3D1%26as%3DbfUSj1vtW0E47VOaHGeZ1g&ltmpl=popup&btmpl=authsub&scc=1&oauth=1"
    })
  );
  
//   app.get("/logout", function (req, res) {
//     res.clearCookie('ttemail')
//     req.logout();
//     res.redirect("https://accounts.google.com/AccountChooser?continue=https://accounts.google.com/o/saml2/initsso?idpid%3DC00n1isy6%26spid%3D350630521091%26forceauthn%3Dfalse%26from_login%3D1%26as%3DbfUSj1vtW0E47VOaHGeZ1g&ltmpl=popup&btmpl=authsub&scc=1&oauth=1");
    // res.end("You have logged out.");
//   });

// Serve only the static files form the angularapp directory
app.use(express.static(__dirname + '/dist/UserManagementAWS'));

app.get('/*', function(req,res) {

res.sendFile(path.join(__dirname+'/dist/UserManagementAWS/index.html'));
});

// Start the app by listening on the default Heroku port
app.listen(process.env.PORT || 8000);
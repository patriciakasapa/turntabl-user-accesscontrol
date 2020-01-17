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

//Install express server
const express = require('express');
const path = require('path');

const app = express();

// Serve only the static files form the angularapp directory
app.use(express.static(__dirname + 'dist/UserManagementAWS'));

app.get('/*', function(req,res) {

res.sendFile(path.join(__dirname+'dist/UserManagementAWS/index.html'));
});

// Start the app by listening on the default Heroku port
app.listen(process.env.PORT || 8080);
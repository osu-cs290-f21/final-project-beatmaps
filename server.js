/**
 * Template for OAuth workflow taken from Spotify API docs. Modified to 
 * be specific to our project
 */

/**
 * This is an example of a basic node.js script that performs
 * the Authorization Code oAuth2 flow to authenticate against
 * the Spotify Accounts.
 *
 * For more information, read
 * https://developer.spotify.com/web-api/authorization-guide/#authorization_code_flow
 */
var http = require('http')
var express = require('express'); // Express web server framework
var request = require('request'); // "Request" library
var cors = require('cors');
var querystring = require('querystring');
var cookieParser = require('cookie-parser');
var spotify = require('./spotify')


/**
 * Generates a random string containing numbers and letters
 * @param  {number} length The length of the string
 * @return {string} The generated string
 */



var app = express();

app.use(express.static(__dirname + '/public'))
   .use(cors())
   .use(cookieParser());

app.get('/login', (req, res)=>{
    spotify.login(req, res)
});

app.get('/callback', function(req, res) {
    spotify.auth(req,res)
    spotify.getTopArtist(req, res)
});

// app.get('/topArtists', function(req, res) {
// });
app.get('/refresh_token', function(req, res) {
  spotify.refresh_token(req, res)
});

app.get('/me', function(req, res, next) {
  console.log('hi')
})

console.log('Listening on 8888');
app.listen(8888);

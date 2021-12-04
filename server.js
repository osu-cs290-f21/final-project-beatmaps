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
const express = require('express'); // Express web server framework
const cors = require('cors');
const cookieParser = require('cookie-parser');
const spotify = require('./spotify');
const events = require('./events');


/**
 * Generates a random string containing numbers and letters
 * @param  {number} length The length of the string
 * @return {string} The generated string
 */

// events.searchConcertsOfArtist("frank ocean","australia").then(
//     (data)=>{
//         console.log(data)
//     },
//     (error)=>{
//         console.log('failed', error)
//     }
// )


const app = express();

app.use(express.static(__dirname + '/public'))
    .use(cors())
    .use(cookieParser());

app.get('/login', (req, res) => {
    spotify.login(req, res)
});

app.get('/callback', function (req, res) {
    spotify.auth(req, res)
});

app.get('/topArtists', function () {
    spotify.getTopArtist()
});

app.get('/refresh_token', function (req, res) {
    spotify.refresh_token(req, res)
});

console.log('Listening on 8888');
app.listen(8888);

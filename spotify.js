const querystring = require("querystring")
const request = require("request")

const client_id = '3e8e08f448744d51bcfd558d6d461a17'; // Your client id
const client_secret = '21d828a45c6041c0baa651c30e149c3e'; // Your secret
const redirect_uri = 'http://localhost:8888/callback'; // Your redirect uri
let stateKey = 'spotify_auth_state';
let access_token;
let refresh_token;

let authOptions;

/**
 * Generates a random string containing numbers and letters
 * @param  {number} length The length of the string
 * @return {string} The generated string
 */
const generateRandomString = function (length) {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
};

const login_h = (req, res) => {

    const state = generateRandomString(16);
    res.cookie(stateKey, state);

    // your application requests authorization
    const scope = 'user-read-private user-read-email user-top-read';
    res.redirect('https://accounts.spotify.com/authorize?' +
        querystring.stringify({
            response_type: 'code',
            client_id: client_id,
            scope: scope,
            redirect_uri: redirect_uri,
            state: state
        }));
    
}

const getTopArtist_h = async () => {
    const options = {
        url: 'https://api.spotify.com/v1/me/top/artists',
        headers: {'Authorization': 'Bearer ' + access_token},
        json: true
    };

    // use the access token to access the Spotify Web API
    return new Promise((resolve, reject) => {
        request.get(options, function (error, response, body) {
            resolve(body)
        })
    });
}

const auth_h = (req, res) => {

    // your application requests refresh and access tokens
    // after checking the state parameter

    const code = req.query.code || null;
    const state = req.query.state || null;
    const storedState = req.cookies ? req.cookies[stateKey] : null;

    if (state === null || state !== storedState) {
        res.redirect('/#' +
            querystring.stringify({
                error: 'state_mismatch'
            }));
    } else {
        res.clearCookie(stateKey);
        authOptions = {
            url: 'https://accounts.spotify.com/api/token',
            form: {
                code: code,
                redirect_uri: redirect_uri,
                grant_type: 'authorization_code'
            },
            headers: {
                'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
            },
            json: true
        };
    }

    request.post(authOptions, function (error, response, body) {
        if (!error && response.statusCode === 200) {

            access_token = body.access_token;
            refresh_token = body.refresh_token;

            // we can also pass the token to the browser to make requests from there
            res.redirect('/topArtists');
        } else {
            res.redirect('/failed');
        }
    })
}

const refresh_token_h = (req, res) => {

    // requesting access token from refresh token
    refresh_token = req.query.refresh_token;
    authOptions = {
        url: 'https://accounts.spotify.com/api/token',
        headers: {'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))},
        form: {
            grant_type: 'refresh_token',
            refresh_token: refresh_token
        },
        json: true
    };

    request.post(authOptions, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            access_token = body.access_token;
            res.send({
                'access_token': access_token
            });
        }
    });
}

module.exports = {
    auth: auth_h,
    login: login_h,
    refresh_token: refresh_token_h,
    getTopArtist: getTopArtist_h
}
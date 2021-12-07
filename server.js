const express = require('express')
const events = require('./events')
const spotify = require('./spotify');
const cookieParser = require("cookie-parser");
const cors = require("cors");
const {printCache} = require("./maps");

const app = express()

app.use(express.static(__dirname + '/public'))
    .use(cors())
    .use(cookieParser());

const time1 = new Date()
events.searchConcertsOfArtist(new Date(2021, 11, 5), new Date(2021, 11, 15), [""], "97229", 10).then(
    (data) => {
        console.log("Data:", data)
        const time2 = new Date()
        printCache()
        console.log("Time:", time2 - time1)
    },
    (error) => {
        console.log('failed', error)
    }
)

app.use(express.static('public'))

//spotify login stuff
app.get('/login', (req, res) => {
    spotify.login(req, res)
});

app.get('/callback', function (req, res) {
    spotify.auth(req, res)
});

app.get('/refresh_token', function (req, res) {
    spotify.refresh_token(req, res)
});

app.get('*', (req, res) => {
    res.status(404).sendFile('/public/404.html')
})

app.listen(3000,
    () => console.log("Listening 3000")
)

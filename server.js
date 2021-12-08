const express = require('express')
const events = require('./events')
const spotify = require('./spotify');
const cookieParser = require("cookie-parser");
const cors = require("cors");
const bodyParser = require('body-parser');
const {splitCity} = require("./utility");

const app = express()

app.use(express.static(__dirname + '/public'))
    .use(cors())
    .use(cookieParser())
    .use(bodyParser.urlencoded({extended: false}))

app.use(express.static('public'))

app.get('/', (req, res)=>{
    res.status(200).sendFile(__dirname + "/public/auth.html")
})

app.post('/search', (req, res, next) => {
    console.log("received")
    console.log(req.body)
    spotify.getTopUser("/artists").then(
        (data) => console.log("Spotify:", data)
    )
    const start_date = new Date(req.body.start_date)
    start_date.setDate(start_date.getDate() + 1)
    const end_date = new Date(req.body.end_date)
    end_date.setDate(end_date.getDate() + 1)
    events.getConcerts(start_date, end_date, [""], req.body.location).then(
        (data) => {
            res.status(200).send(splitCity(events.filterRadius(data, req.body.radius)))
            res.end()
        },
        () => {
            next()
        }
    )
})

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

app.listen(8888,
    () => console.log("Listening 8888")
)

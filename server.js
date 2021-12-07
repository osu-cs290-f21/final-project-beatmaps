const events = require('./events')
const express = require('express'); // Express web server framework
var exphbs = require('express-handlebars')
const cors = require('cors');
const spotify = require('./spotify');
const cookieParser = require("cookie-parser");
const cors = require("cors");
const {printCache} = require("./maps");

const app = express()

app.engine('handlebars', exphbs.engine({ default: 'main'}))
app.set('view engine', 'handlebars')

//app.use(express.static('public'));

//app.use(express.static(__dirname + '/public'))
app.use(cors())
app.use(cookieParser());

app.get('/', function (req, res) {
    res.status(200).render('initPage.handlebars', {
        needAuth: true
    })
})

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
app.get('/findEvent', function (req, res) {
    res.status(200).render('initPage.handlebars', {
        needAuth: false
    })
})

app.get('/topArtists', function () {
    const artists = getTopArtist('top/artists')
    artists.then(
        (data) => {
            console.log(data)
        },
        (err) => {
            console.log(err)
        }
    )
})

app.get('*', (req, res) => {
    res.status(404).sendFile('/public/404.html')
})

app.listen(3000,
    () => console.log("Listening 3000")
)

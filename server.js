const express = require('express'); // Express web server framework
var exphbs = require('express-handlebars')
const spotify = require('./spotify');
const cookieParser = require("cookie-parser");
const cors = require("cors");
const utility = require("./utility")
const {getTopArtist} = require("./spotify");
const events = require('./events')

events.searchConcertsOfArtist(new Date(2021, 11, 5), new Date(2021, 11, 15), [""], "97229").then(
    (data) => {
        console.log("Data:", data)
    },
    (error) => {
        console.log('failed', error)
    }
)

const app = express();

app.engine('handlebars', exphbs.engine({ default: 'main'}))
app.set('view engine', 'handlebars')

//app.use(express.static('public'));

//app.use(express.static(__dirname + '/public'))
app.use(cors())
app.use(cookieParser());

app.use(express.static('public'))

app.get('/', function (req, res) {
    res.status(200).render('initPage.handlebars', {
        needAuth: true
    })
})

app.get('/login', (req, res) => {
    spotify.login(req, res)
});

app.get('/callback', function (req, res) {
    spotify.auth(req, res)
});

app.get('/topArtists', function () {
    const artists = getTopArtist()
    artists.then(
        (data) => {
            console.log(data)
        },
        (err) => {
            console.log(err)
        }
    )
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

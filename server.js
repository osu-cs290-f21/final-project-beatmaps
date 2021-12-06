const express = require('express'); // Express web server framework
var exphbs = require('express-handlebars')
const cors = require('cors');
const cookieParser = require('cookie-parser');
const spotify = require('./spotify');
const {getTopArtist} = require("./spotify");

const app = express();

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

app.get('/login', (req, res) => {
    spotify.login(req, res)
});

app.get('/callback', function (req, res) {
    spotify.auth(req, res)
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

console.log('Listening on 8888');
app.listen(8888);
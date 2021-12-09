const express = require('express')
const events = require('./events')
const exphbs = require('express-handlebars');
const spotify = require('./spotify');
const cookieParser = require("cookie-parser");
const cors = require("cors");
const bodyParser = require('body-parser');
const {splitCity} = require("./utility");
const {geocode} = require("./maps")

let searchResult = {}
let userInput;
let searchResultPromise;
let artist_list;
let userData;

const app = express()

app.engine('handlebars', exphbs.engine({default: 'main'}))
app.set('view engine', 'handlebars')

app.use(express.static(__dirname + '/public'))
    .use(cors())
    .use(cookieParser())
    .use(bodyParser.urlencoded({extended: false}))

app.use(express.static('public'))

app.get('/', function (req, res) {
    res.status(200).render('initPage.handlebars')
})

app.get('/findEvent', function (req, res) {
    spotify.getCurrentUser("").then(
        data => {
            userData = data
            res.status(200).render('search.handlebars', {
                display_name: data.display_name,
                display_url: data.images[0].url
            })
        }
    )
})

app.get('/result', (req, res)=>{
    searchResultPromise.then(
        ()=>{
    context = {city: splitCity(searchResult)}
    res.status(200).render('results', context)}
    )
})

app.post('/search', async (req, res, next) => {
    console.log("in search")
    userInput = req.body

    const start_date = new Date(userInput.start_date)
    start_date.setDate(start_date.getDate() + 1)
    const end_date = new Date(userInput.end_date)
    end_date.setDate(end_date.getDate() + 1)

    searchResultPromise = events.getConcerts(start_date, end_date, artist_list, userInput.location).then(
        (data) => {
            searchResult = data
            console.log("done search")
            res.status(204).end()
        },
        () => {
            next()
        }
    )
})

app.get('/searchSplitCity', (req, res) => {
    searchResultPromise.then(
        () => {
            const result = splitCity(searchResult)
            res.status(200).send(result)
            res.end()
        }
    )
})

app.get('/searchGetResult', (req, res) => {
    searchResultPromise.then(
        () => {
            console.log("Getting results", searchResult)
            res.status(200).send(searchResult)
            res.end()
        }
    )
})

app.get('/userCoords', (req, res) => {
    geocode(userInput.location).then(
        data => {
            res.status(200).send({
                coords: data,
                radius: userInput.radius
            })
            res.end()
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

app.get('/topArtists', (req, res) => {
    spotify.getCurrentUser("/top/artists?limit=10").then(
        (data) => {
            console.log(data)
            artist_list = data.items.map(
                (objects) => {
                    return {
                        "name": objects.name,
                        "picture": objects.images[0].url
                    }
                }
            )
        }
    )
    res.redirect("/findEvent")
})

app.get('*', (req, res) => {
    res.status(404).sendFile(__dirname + '/public/404.html')
})

app.listen(8888,
    () => console.log("Listening 8888")
)


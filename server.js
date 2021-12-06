const express = require('express')
const events = require('./events')

const app = express()

events.searchConcertsOfArtist(new Date(2021, 11, 5), new Date(2021, 11, 15), ["KALEO", "Jubilate!"], "Oregon").then(
    (data) => {
        console.log("In server", data)
    },
    (error) => {
        console.log('failed', error)
    }
)

app.use(express.static('public'))

app.get('*', (req, res) => {
    res.status(404).sendFile('/public/404.html')
})

app.listen(3000,
    () => console.log("Listening 3000")
)

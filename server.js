const express = require('express')
const events = require('./events')

const app = express()

app.use((req, res, next) => {
    const eventsHTML = events.searchConcertsOfArtist("Ed Sheeran", "Portland").then(
        (data)=>{
            console.log("dataaa", data)
            res.status(200).end(data)
        },
        ()=>{
            console.log('failed')
            res.status(404).end()
        }
    )
})

app.use(express.static('public'))

app.get('*',)

app.listen(3000)

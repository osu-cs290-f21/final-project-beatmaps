const express = require('express')
const events = require('./events')

const app = express()

const eventsHTML = events.searchConcertsOfArtist("frank ocean","australia").then(
    (data)=>{
        console.log(data)
    },
    (error)=>{
        console.log('failed', error)
    }
)

app.use(express.static('public'))

app.get('*',)

app.listen(3000)

const express = require('express')
const events = require('./events')

const app = express()

events.searchConcertsOfArtist("","").then(
    (data)=>{
        console.log(data)
    },
    (error)=>{
        console.log('failed', error)
    }
)

app.use(express.static('public'))

app.get('*',(req,res) => {
    res.status(404).end()
})

app.listen(3000)

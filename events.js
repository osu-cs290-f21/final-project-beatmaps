const serp = require('google-search-results-nodejs');
const { http, https } = require('follow-redirects');
// const https = require('https')
const { parse } = require('node-html-parser');

const search = async(artist, location) => {

    artist = artist.replace(" ", "+")

    const searchString = "/search?q=" + artist + "+concert+" + location + "&oq=concerts" + "&ibp=htl;events"

    console.log('Search path:', searchString)

    const options = {
        host: "google.com",
        path: searchString,
        method: 'GET',
        headers: {
            'Content-Type': 'text/html',
        }
    };

    const req = https.get(options, (res)=>{
        console.log('statuscode:', res.statusCode)

        let fullHTML = '';

        res.on('data', (data) => {
            fullHTML += data
        })
        res.on('end', ()=>{
            // console.log(fullHTML)
            const parsed = parse(fullHTML)
            // console.log(parsed)
            // console.log(parsed.getElementsByTagName('img')[0])
            return parsed
        })
        res.on('error', ()=>{
            return HTMLElement
        })
    })

    req.end()
}

module.exports = {
    searchConcertsOfArtist: search,
}

// https://www.google.com/search
// ?q=ed+sheeran+concert
// &oq=concerts
// &aqs=edge.0.69i59.1658j0j1
// &sourceid=chrome
// &ie=UTF-8
// &ibp=htl;events
// &rciv=evn
// &sa=X
// &ved=2ahUKEwjCofPrncT0AhW2JTQIHXEuAGYQ8eoFKAJ6BAgVEA8#fpstate=tldetail
// &htivrt=events
// &htidocid=L2F1dGhvcml0eS9ob3Jpem9uL2NsdXN0ZXJlZF9ldmVudC8yMDIxLTEyLTAzfDQxNTI4OTIzNTc3MDQ1NzU1Mjc%3D

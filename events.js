const {https} = require('follow-redirects');
const {parse} = require('node-html-parser');

const search = async (artist, location) => {

    artist = artist.replace(" ", "+")
    location = location.replace(" ", "+")

    const options = {
        host: "google.com",
        path: "/search?q=" + artist + "+concert+" + location + "&oq=concerts" + "&ibp=htl;events",
        method: 'GET',
        headers: {
            'Content-Type': 'text/html',
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.55 Safari/537.36'
        }
    };

    return new Promise((resolve, reject) => {
        const req = https.get(options, (res) => {

            let fullHTML = '';

            res.on('data', (data) => {
                fullHTML += data
            })

            res.on('end', () => {
                const array = parse(fullHTML).querySelectorAll('.gws-horizon-textlists__tl-lif')

                resolve(
                    array.map(element => {
                        return {
                            date: element.querySelector('.UIaQzd').innerText,
                            month: element.querySelector('.wsnHcb').innerText,
                            title: element.querySelector('.YOGjf').innerText,
                            duration: element.querySelector('.cEZxRc').innerText,
                            location: element.querySelector('.cEZxRc.zvDXNd').innerText,
                            city: element.querySelectorAll('.cEZxRc.zvDXNd')[1].innerText,
                        }
                    })
                )
            })
        })
        req.on('error', (e) => {
            reject(e)
        })
        req.end()
    })
}

module.exports = {
    searchConcertsOfArtist: search,
}

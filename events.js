const {https} = require('follow-redirects');
const {parse} = require('node-html-parser');

const search = async (artist, location) => {

    let artistList = []

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
                const parsed = parse(fullHTML)

                const array = parsed.querySelectorAll('.gws-horizon-textlists__tl-lif')
                for (let i = 0; i < array.length; i++) {
                    artistList.push({
                        date: array[i].querySelector('.UIaQzd').innerText,
                        month: array[i].querySelector('.wsnHcb').innerText,
                        title: array[i].querySelector('.YOGjf').innerText,
                        duration: array[i].querySelector('.cEZxRc').innerText,
                        location: array[i].querySelector('.cEZxRc.zvDXNd').innerText,
                        city: array[i].querySelectorAll('.cEZxRc.zvDXNd')[1].innerText,
                    })
                }
                resolve(artistList)
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

const {https} = require('follow-redirects');
const {parse} = require('node-html-parser');
const utility = require("./utility")
/**
 * Limit number to a range
 */
Number.prototype.clamp = function (min, max) {
    return Math.min(Math.max(this, min), max);
};

/**
 * Send a search query to Google with a templated search string, return a list of about 10 events according to inputs
 * @param artist Artist to search for
 * @param location Location to search around
 * @param date date string to search around
 * @returns {Promise<unknown>} List of events
 */
const search = async (artist, location, date) => {

    artist = artist.replace(" ", "+")
    location = location.replace(" ", "+")
    date = date.replace(" ", "+")

    const options = {
        host: "google.com",
        path: "/search?q=" + artist + "+concert+" + location + "+on+" + date + "&oq=concerts" + "&ibp=htl;events",
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
                            path: options.path
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

/**
 * Get events by requesting the events page from Google and parsing the HTML
 * @param start_date The start date of your search range (type Date)
 * @param end_date The end date of your search range(type Date)
 * @param artists The artists that you want to loop through (type Array)
 * @param location The location that you want to search around (type String)
 * @returns {Promise<*[]>} List of event Objects
 */
const getEvents = async (start_date, end_date, artists, location) => {
    let current_event_list = [];
    let promise_list = []
    for (let i = start_date; i < end_date; i.setDate(i.getDate() + 1)) { //loop through date
        const date_string = `${utility.monthString(i.getMonth())} ${i.getDate()}${utility.date_suffix(i.getDate())}` //construct string of date "[Month] [Date][Date suffix]"

        for (let j = 0; j < artists.length; j++) { //loop through artist
            promise_list.push(search(artists[j], location, date_string).then(
                    data => current_event_list.push.apply(current_event_list, data),
                    (error) => {
                        throw error
                    }
                )
            )
        }
    }
    return Promise.all(promise_list).then(
        () => {
            current_event_list = [...new Set(current_event_list)].sort(utility.compareDate)

            return current_event_list
        }
    )
}

module.exports = {
    searchConcertsOfArtist: getEvents,
}

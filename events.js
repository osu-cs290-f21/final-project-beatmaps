const {https} = require('follow-redirects');
const {parse} = require('node-html-parser');
const utility = require("./utility")
const {getDistance} = require("./utility");
const {geocode} = require("./maps");
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
 * @param radius radius from location to filter events
 * @returns {Promise<unknown>} List of events
 */
const search_h = async (artist, location, date, radius) => {

    artist = artist.replace(" ", "+")
    date = date.replace(" ", "+")

    const location_coords = await geocode(location)

    const options = {
        host: "google.com",
        path: "/search?q=" + artist + "+concert+" + location.replace(" ", "+") + "+on+" + date + "&oq=concerts" + "&ibp=htl;events",
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

                let result_array = []
                let promise_array = []

                for (let i = 0; i < array.length; i++) {
                    const destination = array[i].querySelector('.cEZxRc.zvDXNd').innerText
                    promise_array.push(getDistance(location_coords, destination).then(
                        data => {
                            if (data.coords[0] !== data.coords[1] && data.coords[0] !== 0 && data.distance <= radius)
                                result_array.push({
                                        date: array[i].querySelector('.UIaQzd').innerText,
                                        month: array[i].querySelector('.wsnHcb').innerText,
                                        title: array[i].querySelector('.YOGjf').innerText,
                                        duration: array[i].querySelector('.cEZxRc').innerText,
                                        location: destination,
                                        city: array[i].querySelectorAll('.cEZxRc.zvDXNd')[1].innerText,
                                        path: options.path,
                                        coords: data.coords,
                                        distance: data.distance
                                })
                        }
                    ))
                }

                resolve(Promise.all(promise_array).then(() => {
                    return result_array
                }))
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
 * @param radius The radius to limit results in
 * @returns {Promise<*[]>} List of event Objects
 */
const getEvents = async (start_date, end_date, artists, location, radius = 30) => {
    let current_event_list = [];
    let promise_list = []
    for (let i = start_date; i < end_date; i.setDate(i.getDate() + 1)) { //loop through date
        const date_string = `${utility.monthString(i.getMonth())} ${i.getDate()}${utility.date_suffix(i.getDate())}` //construct string of date "[Month] [Date][Date suffix]"

        for (let j = 0; j < artists.length; j++) { //loop through artist
            promise_list.push(search_h(artists[j], location, date_string, radius).then(
                    data => {
                        current_event_list.push.apply(current_event_list, data)
                    },
                    (error) => {
                        throw error
                    }
                )
            )
        }
    }
    return Promise.all(promise_list).then(
        () => {
            current_event_list = [...new Map(current_event_list.map(v => [JSON.stringify(v), v])).values()].sort(utility.compareDate)
            return current_event_list
        }
    )
}

module.exports = {
    searchConcertsOfArtist: getEvents,
    search: search_h
}

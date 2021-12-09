const {https} = require('follow-redirects');
const {parse} = require('node-html-parser');
const utility = require("./utility")
const {geocode} = require("./maps");
/**
 * Limit number to a range
 */
Number.prototype.clamp = function (min, max) {
    return Math.min(Math.max(this, min), max);
};

/**
 * Send a search query to Google with a templated search string, return a list of about 10 events according to inputs
 * @param {Object}artist Artist to search for
 * @param {string}location Location to search around
 * @param {string}date date string to search around
 * @returns {Promise<Object[]>} List of events
 */
const search_h = async (artist, location, date) => {

    artist.name = artist.name.replace(" ", "+")
    date = date.replace(" ", "+")

    const options = {
        host: "google.com",
        path: "/search?q=" + artist.name + "+concert+" + location.replace(" ", "+") + "+on+" + date + "&oq=concerts" + "&ibp=htl;events",
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
                    const city = array[i].querySelectorAll('.cEZxRc.zvDXNd')[1].innerText
                    promise_array.push(utility.getDistance(location, destination + ' ' +city.split(' ')[1]).then(
                        data => {
                            if (data.coords[0] !== data.coords[1] && data.coords[0])
                                result_array.push({
                                    date: array[i].querySelector('.UIaQzd').innerText,
                                    month: array[i].querySelector('.wsnHcb').innerText,
                                    title: array[i].querySelector('.YOGjf').innerText,
                                    duration: array[i].querySelector('.cEZxRc').innerText,
                                    location: destination,
                                    city: city,
                                    artist: artist.name,
                                    artist_picture: artist.picture,
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
 * @param {Date}start_date The start date of your search range (type Date)
 * @param {Date}end_date The end date of your search range(type Date)
 * @param {Object[]}artists The artists that you want to loop through (type Array)
 * @param {String}location The location that you want to search around (type String)
 * @returns {Promise<Object[]>} List of event Objects
 */
const getConcerts_h = async (start_date, end_date, artists, location) => {
    let current_event_list = [];
    let promise_list = [];
    await geocode(location) //to cache input location
    for (let i = start_date; i <= end_date; i.setDate(i.getDate() + 1)) { //loop through date
        const date_string = `${utility.monthString(i.getMonth())} ${i.getDate()}${utility.date_suffix(i.getDate())}` //construct string of date "[Month] [Date][Date suffix]"

        for (let j = 0; j < artists.length; j++) { //loop through artist
            promise_list.push(search_h(artists[j], location, date_string).then(
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
            return current_event_list.filter(utility.unique).sort(utility.compareDate)
        }
    )
}

/**
 * filter events from event_array that is farther from the radius
 * @param {Object[]}event_array
 * @param {number}radius
 * @returns {Object[]}
 */
const filterRadius_h = (event_array, radius) => {
    let result_array = []
    for(let i = 0; i < event_array.length; i++){
        if(event_array[i].distance <= radius){
            result_array.push(event_array[i])
        }
    }
    return result_array
}

module.exports = {
    getConcerts: getConcerts_h,
    search: search_h,
    filterRadius: filterRadius_h
}

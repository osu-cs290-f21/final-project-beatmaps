const {geocode, distance} = require("./maps");

/**
 * compare 2 objects with the "date" attributes
 */
function compareDate_h(a, b) {
    const aDate = parseInt(a.date)
    const bDate = parseInt(b.date)
    return (aDate - bDate).clamp(-1, 1)
}

/**
 * Return the suffix of the day of the month ("st", "nd", etc.)
 */
function date_suffix_h(date) {
    return ['th', 'st', 'nd', 'rd', 'th'][date.clamp(0, 4)]
}


/**
 * Generates a random string containing numbers and letters
 * @param  {number} length The length of the string
 * @return {string} The generated string
 */
function randomString (length) {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

/**
 * Return string of corresponding month number, assuming January is 0
 * @param  {String}month
 * @return {String}
 */
function monthString_h(month) {
    return ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"][month]
}

/**
 * Return distance between 2 location strings
 * @param {String}origin
 * @param {String}event_location
 * @returns {Promise<{distance: *, coords: *|number[]}>}
 */
function getDistance_h(origin, event_location) {
    return Promise.all([
        geocode(origin),
        geocode(event_location.split(", ").at(-1))
    ]).then(
        (data) => {
            return {
                "distance": distance(data[0], data[1]),
                "coords": data[1]
            }
        }
    )
}

/**
 * Takes in array of events and split them into buckets of cities
 * @param {Object[]}event_array array of events
 * @returns {Object} Object of cities with list of events in each city
 */
const splitCity_h = (event_array) => {
    let result = {}
    for(let i = 0; i < event_array.length; i++){
        if(!(event_array[i].city in result)){
            result[event_array[i].city] = [event_array[i]]
        } else {
            result[event_array[i].city].push(event_array[i])
        }
    }
    return result
}

module.exports = {
    compareDate: compareDate_h,
    date_suffix: date_suffix_h,
    monthString: monthString_h,
    getDistance: getDistance_h,
    generateRandomString: randomString,
    splitCity: splitCity_h
}

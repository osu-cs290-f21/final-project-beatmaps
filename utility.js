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
 * Return string of corresponding month number, assuming January is 0
 */
function monthString_h(month) {
    return ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"][month]
}

function getDistance_h(origin, event_location) {
    return Promise.all([
        geocode(origin),
        geocode(event_location.split(", ").at(-1))
    ]).then(
        (data)=> {
            console.log(data)
            return distance(data[0], data[1])
        }
    )
}

// export function filterCity(event_array, city)

module.exports = {
    compareDate: compareDate_h,
    date_suffix: date_suffix_h,
    monthString: monthString_h,
    getDistance: getDistance_h
}

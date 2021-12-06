const maps = require('./maps')

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

function filterZipCode_h(event_array, zip_code) {
    let destinations = event_array.map(
        element => {
            return element.location
        }
    )
    maps.distance(zip_code, destinations)
    // console.log(distances)
}

// export function filterCity(event_array, city)

module.exports = {
    compareDate: compareDate_h,
    date_suffix: date_suffix_h,
    monthString: monthString_h,
    filterZipCode: filterZipCode_h
}

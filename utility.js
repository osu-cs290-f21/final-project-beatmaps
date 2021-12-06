const maps = require('./maps')

/**
 * compare 2 objects with the "date" attributes
 */
export function compareDate(a, b) {
    const aDate = parseInt(a.date)
    const bDate = parseInt(b.date)
    return (aDate - bDate).clamp(-1, 1)
}

/**
 * Return the suffix of the day of the month ("st", "nd", etc.)
 */
export function date_suffix(date) {
    return ['th', 'st', 'nd', 'rd', 'th'][date.clamp(0, 4)]
}

/**
 * Return string of corresponding month number, assuming January is 0
 */
export function monthString(month) {
    return ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"][month]
}

export function filterDistance(event_array, location, radius){
    let destinations = event_array.map(
        element => {
            return element.location
        }
    )
    let distances = maps.get_distance(location, destinations)
    console.log(distances)
}

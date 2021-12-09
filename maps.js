const {geocoding} = require("./library/traveltime");
//store your credentials in an environment variable
process.env['TRAVELTIME_ID'] = 'enter your traveltime api id';
process.env['TRAVELTIME_KEY'] = 'enter your traveltime api key';

let cache = {}

const geocode_h = async (query) => {
    const options = {
        query: query,
        within_country: 'USA',
        limit: '1'
    }
    if (options.query in cache) {
        return cache[options.query]
    } else {
        return geocoding(options).then(
            (data) => {
                cache[options.query] = data.features[0].geometry.coordinates
                return cache[options.query]
            }
        ).catch(() => {
            return [0, 0]
        })
    }
}

const distance_h = (origin, destination) => {
    const R = 3958.8; // miles
    const lat1 = origin[1] * Math.PI / 180; // φ, λ in radians
    const lat2 = destination[1] * Math.PI / 180;
    const deltaLat = (destination[1] - origin[1]) * Math.PI / 180;
    const deltaLon = (destination[0] - origin[0]) * Math.PI / 180;

    const a = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
        Math.cos(lat1) * Math.cos(lat2) *
        Math.sin(deltaLon / 2) * Math.sin(deltaLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // in miles
}

module.exports = {
    distance: distance_h,
    geocode: geocode_h
}

const traveltimejs = require('./library/traveltime');
//store your credentials in an environment variable
process.env['TRAVELTIME_ID'] = 'dd503376';
process.env['TRAVELTIME_KEY'] = '606ddd0ff147c22f1280f7a981fc090a';

const geocode_h = (query) => {
    const options = {
        query: query,
        within_country: 'USA',
        limit: 1
    }
    return traveltimejs.geocoding(options).then(
        (data) => {
            console.log(query)
            return data.features[0].geometry.coordinates
        }).catch((e) => {
        console.log(e)
    })
}

const distance_h = (origin, destinations) => {
    const promise_list = []
    let locations = [];
    promise_list.push(
        geocode_h(origin).then(data => {
            locations = [{"id": "origin", "coords": {"lat": data[0], "lng": data[1]}}]
        })
    )
    destinations.forEach(
        (destin, index) => {
            promise_list.push(
                geocode_h(destin.split(", ").at(-1)).then(data => {
                    locations.push({
                        "id": `destination ${index}`,
                        "coords": {"lat": data[0], "lng": data[1]}
                    })
                })
            )
        }
    )
    Promise.all(promise_list).then(
        (data) => {
            console.log("locations:", locations)
            console.log("data:", data)
        }
    )
}

module.exports = {
    distance: distance_h,
    geocode: geocode_h
}

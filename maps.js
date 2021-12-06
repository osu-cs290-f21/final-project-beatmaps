const maps_distance = require('google-distance-matrix')

maps_distance.key('AIzaSyCleAO0L-ilQ0Vb-yGOmQHV6bfnfPg72TA')

const distance = (origin, destinations) => maps_distance.matrix([origin], destinations, function (err, distances) {
    if (!err)
        console.log(distances);
})

module.exports = {
    get_distance: distance
}

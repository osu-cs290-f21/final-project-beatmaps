const traveltimejs = require('./library/traveltime');
//store your credentials in an environment variable
process.env['TRAVELTIME_ID'] = 'dd503376';
process.env['TRAVELTIME_KEY'] = '606ddd0ff147c22f1280f7a981fc090a';

const geocode_h = (query) => {
    const options = {
        query: query + " OR",
        within_country: 'USA',
        limit: '1'
    }
    return traveltimejs.geocoding(options).then(
        (data) => {
            return data.features[0].geometry.coordinates
        }).catch((e) => {
        throw e
    })
}

const distance_h = (origin, destination) => {

}

module.exports = {
    distance: distance_h,
    geocode: geocode_h
}


//https://www.google.com/maps/dir/
// Portland,+OR+97229/2300+SW+1st+Ave+%23103,+Portland,+OR+
// 97201/@45.5319744,-122.793511,13z/data=!4m14!4m13!1m5!1m1!1s0x5495089368454bfb:0x5c0303c43f70b1f6!2m2!1d-122.807445!2d45.5593978!1m5!1m1!1s0x54950a14ccb00027:0x814751b8635553ce!2m2!1d-122.678275!2d45.506202!3e0

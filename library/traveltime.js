const axios = require('axios');

exports.geocoding = function ({query, within_country = undefined, exclude_location_types = undefined}) {

    queryFull = {
        'query': query,
        'within.country': within_country,
        'exclude.location.types': exclude_location_types
    }

    return traveltime_api(['geocoding', 'search'], undefined, queryFull)
}

function get_api_headers() {

    let ttid = process.env['TRAVELTIME_ID'];
    let ttkey = process.env['TRAVELTIME_KEY'];

    if (ttid === undefined) {
        throw new Error("Please set env var TRAVELTIME_ID to your Travel Time Application Id");
    }
    if (ttkey === undefined) {
        throw new Error("Please set env var TRAVELTIME_KEY to your Travel Time Api Ke");
    }

    return {'X-Application-Id': ttid, 'X-Api-Key': ttkey, 'User-Agent': 'Travel Time NodeJS SDK'}
}

function traveltime_api(path, body, query) {

    opts = {
        url: 'https://api.traveltimeapp.com/v4/' + path.join("/"),
        headers: get_api_headers()
    };

    if (body === undefined) {
        opts.method = 'GET';
    } else {
        opts.method = 'POST';
        opts.data = body;
    }

    if (query !== undefined) {
        opts.params = query;
    }

    return axios(opts).then(succ => succ.data,
        err => {
            throw err.response.data
        })
}

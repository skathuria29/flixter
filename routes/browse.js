const {apiKey, base_uri, APPNAME} = require('../config/settings');
const request = require('request');

const getNowPlaying = (callback) => {
    const url = base_uri + '/3/movie/now_playing?api_key=' + apiKey + "&language=en-US";
    request(url  , { json : true} , (err, resp, body) => {
        if(err)
            return callback(null, [])

        if(body)
            callback(null, body.results);
    })
}

const getUpcoming = (callback) => {
    const url = base_uri + '/3/movie/upcoming?api_key=' + apiKey + "&language=en-US";
    request(url  , { json : true} , (err, resp, body) => {
        if(err)
            return callback([])

        if(body)
            callback(null, body.results);
    })
}


const getPopular = (callback) => {
    const url = base_uri + '/3/movie/popular?api_key=' + apiKey + "&language=en-US";
    request(url  , { json : true} , (err, resp, body) => {
        if(err)
            return callback(null, [])

        if(body)
            callback(null, body.results);
    })
}

const getTopRated = (callback) => {
    const url = base_uri + '/3/movie/top_rated?api_key=' + apiKey + "&language=en-US";
    request(url  , { json : true} , (err, resp, body) => {
        if(err)
            return callback(null, [])

        if(body)
            callback(null, body.results);
    })
}

module.exports= {
    getNowPlaying,
    getUpcoming,
    getPopular,
    getTopRated
}
const {apiKey, base_uri} = require('../config/settings');
const request = require('request');
const moment = require('moment');

const getMovieInfo = (id, callback) => {
    const url = base_uri + `/3/movie/${id}?api_key=${apiKey}&language=en-US&append_to_response=videos`;
    request(url  , { json : true} , (err, resp, body) => {
        if(err)
            return callback(null, [])

        if(body){
            let out = [{
                'movie_id' : body.id,
                'backdrop_path' : body.backdrop_path,
                'homepage' : body.homepage,
                'imdb_id' : body.imdb_id,
                'title' : body.original_title,
                'overview' : body.overview,
                'poster_path' : body.poster_path,
                'release_date' : moment(new Date(body.release_date)).format('DD MMM YYYY'),
                'production_companies' : body.production_companies,
                'production_countries' : body.production_countries,
                'popularity' : body.popularity,
                'duration' : `${body.runtime / 60 ^ 0}hr ` + body.runtime % 60 + 'm',
                'genres' : body.genres,
                'trailer' : body.videos ? (body.videos.results.length ? body.videos.results[0].key : '' ): ''
            }];
    
            if(out[0].genres.length >0){
                for(let each of out[0].genres){
                    each['genre_link'] =  base_uri + `/3/discover/movie?api_key=${apiKey}&language=en-US&sort_by=popularity.desc&with_genres=${each.id}`;
                }
            }
            callback(null, out);
        }
            
    })
}

const getSimilarMovies = (id, callback) => {
    const url = base_uri + `/3/movie/${id}/similar?api_key=${apiKey}&language=en-US`;
    request(url  , { json : true} , (err, resp, body) => {
        if(err)
            return callback(null, [])
        if(body)
            callback(null, body.results);

    })
}

const getMovieCredits = (id, callback) => {
    const url = base_uri + `/3/movie/${id}/credits?api_key=${apiKey}&language=en-US`;
    request(url  , { json : true} , (err, resp, body) => {
        if(err)
            return callback(null, [])
        if(body)
            callback(null, body.cast.splice(0, 12));

    })
}

module.exports ={
    getMovieInfo,
    getSimilarMovies,
    getMovieCredits
}
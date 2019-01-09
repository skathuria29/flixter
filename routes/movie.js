const express = require('express');
const router = express.Router();
const {apiKey, base_uri} = require('../config/settings');
const request = require('request');
const ensureAuth = require('./auth');
const moment = require('moment');
const async = require('async');

const browse = require('./browse');

router.get('/browse',  ensureAuth, (req, res) => {
    async.parallel({

        'Now Playing' : function(callback){
            browse.getNowPlaying(function(err, data){
                callback(null, data);
            })
        },
        'Upcoming' : function(callback){
            browse.getUpcoming(function(err, data){
                callback(null, data);
            })
        },
        'Top Rated' : function(callback){
            browse.getTopRated(function(err, data){
                callback(null, data);
            })
        }


     }, function(err, results){
        console.log(results);
        let out = [];
        for(let each in results){
            let temp = {};
            temp['title'] = each;
            temp['data'] = results[each];
            out.push(temp);
        }

        let user = null;
        if(req.user){ 
            user = {
                name : req.user.username,
                email : req.user.email
            }
        }


        res.render('main' , { title : 'MovieDB' , 'result' : out ,  'user' : user});
     })
})

router.get('/genre', ensureAuth, (req, res) => {

    //get movies
    const url = base_uri + '/3/discover/movie?api_key=' + apiKey + "&language=en-US&sort_by=popularity.desc";
    request(url  , { json : true} , (err, resp, body) => {
        if (err) { return console.log(err); }
        
        console.log(body);
        // let body = {};
        // body['results'] = [1,2,3,4,5,6,7,8,9,10, 11, 12,13,14,15,16,17,18,19,20]
        let user = null;
        if(req.user){ 
            user = {
                name : req.user.username,
                email : req.user.email
            }
        }


        res.render('browse' , { title : 'MovieDB' , 'data' : body.results , 'page' : body.page , 'url' : url , 'user' : user});
   })
    
})

router.get('/movie/:mid', ensureAuth, (req,res) => {

    const movie_id = req.params.mid;
    const url = base_uri + `/3/movie/${movie_id}?api_key=${apiKey}&language=en-US`;
    request(url  , { json : true} , (err, resp, body) => {
        if (err) { return console.log(err); }

        let user = null;
        if(req.user){ 
            user = {
                name : req.user.username,
                email : req.user.email
            }
        }



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
            'genres' : body.genres
        }];

        if(out[0].genres.length >0){
            for(let each of out[0].genres){
                each['genre_link'] =  base_uri + `/3/discover/movie?api_key=${apiKey}&language=en-US&sort_by=popularity.desc&with_genres=${each.id}`;
            }
        }

        //res.json(body);
        res.render('movie-info', {'title' : 'MovieDB' , 'user' : user,  'data' : out})

    })
})

module.exports = router;

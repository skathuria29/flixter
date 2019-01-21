const express = require('express');
const router = express.Router();
const {apiKey, base_uri, APPNAME} = require('../config/settings');
const request = require('request');
const ensureAuth = require('./auth');
const moment = require('moment');
const async = require('async');

const browse = require('./browse');
const movieInfo = require('./movie-info');

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
        //console.log(results);
        let latest = [];
        if(results['Now Playing'].length){
            latest.push(results['Now Playing'][0])
        }
            
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


        res.render('main' , { title : APPNAME , 'result' : out ,  'user' : user, 'latest' : latest});
     })
})

// router.get('/genre', ensureAuth, (req, res) => {

//     //get movies
//     const url = base_uri + '/3/discover/movie?api_key=' + apiKey + "&language=en-US&sort_by=popularity.desc";
//     request(url  , { json : true} , (err, resp, body) => {
//         if (err) { return console.log(err); }
        
//         console.log(body);
//         // let body = {};
//         // body['results'] = [1,2,3,4,5,6,7,8,9,10, 11, 12,13,14,15,16,17,18,19,20]
//         let user = null;
//         if(req.user){ 
//             user = {
//                 name : req.user.username,
//                 email : req.user.email
//             }
//         }


//         res.render('browse' , { title : APPNAME , 'data' : body.results , 'page' : body.page , 'url' : url , 'user' : user});
//    })
    
// })

router.get('/movie/:mid', ensureAuth, (req,res) => {

    const movie_id = req.params.mid;
    async.parallel({
        'info' : function(callback){
            movieInfo.getMovieInfo(movie_id, function(err, data){
                callback(null, data);
            })
        },
        'credits' : function(callback){
            movieInfo.getMovieCredits(movie_id, function(err, data){
                return callback(null, data)
            })
        },
        'similar' : function(callback){
            movieInfo.getSimilarMovies(movie_id, function(err, data){
                callback(null, data);
            })
        }
    }, function(err, results){
        let user = null;
        if(req.user){ 
            user = {
                name : req.user.username,
                email : req.user.email
            }
        }

        //res.json(body);
        res.render('movie-info', {'title' : APPNAME , 'user' : user,  'data' : results['info'] , 'credits' : results['credits'] , 'similar' : results['similar']})
    })

})

router.get('/genre/:name/:gid', ensureAuth,  (req, res) => {
    const gid = req.params.gid;
    const gname= req.params.name;

    const url =  base_uri + `/3/discover/movie?api_key=${apiKey}&language=en-US&sort_by=popularity.desc&with_genres=${gid}`;
    request(url  , { json : true} , (err, resp, body) => {
        if (err) { return console.log(err); }
        
        //console.log(body);
        // let body = {};
        // body['results'] = [1,2,3,4,5,6,7,8,9,10, 11, 12,13,14,15,16,17,18,19,20]
        let user = null;
        if(req.user){ 
            user = {
                name : req.user.username,
                email : req.user.email
            }
        }


        res.render('browse' , { title : APPNAME , 'data' : body.results , 'page' : body.page , 'url' : url , 'user' : user , 'header' : gname , 'genre' : gid});


    })

})

router.post('/search/movie', ensureAuth,  (req, res) => {
    const keyword = req.body.keyword;
    const url =  base_uri + `/3/search/movie?api_key=${apiKey}&language=en-US&sort_by=popularity.desc&query=${keyword}`;
    const header = `Search for - ${keyword}`
    request(url  , { json : true} , (err, resp, body) => {
        if (err) { return console.log(err); }
        //console.log(body);
        let user = null;
        if(req.user){ 
            user = {
                name : req.user.username,
                email : req.user.email
            }
        }

        res.render('browse' , { title : APPNAME , 'data' : body.results , 'page' : body.page , 'url' : url , 'user' : user , 'header' : header , 'search' : keyword});
    })

})

module.exports = router;

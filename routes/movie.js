const express = require('express');
const router = express.Router();
const {apiKey, base_uri} = require('../config/settings');
const request = require('request');
const ensureAuth = require('./auth');

router.get('/browse', ensureAuth, (req, res) => {

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

module.exports = router;

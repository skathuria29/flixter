var express = require('express');
var router = express.Router();

router.get('/', ensureAuthenticated, function(req, res){
    //res.render('index');
    res.send('authenticated');
});

function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		return next();
	} else {
		//req.flash('error_msg','You are not logged in');
        // res.redirect('/users/login');
        //res.send('register yourself');
        res.render('home' , {title : 'MovieDB', user : null})
	}
}

router.get('/login' , (req, res) =>{
    res.render('login' , { title : 'MovieDB'});
})

module.exports = router;


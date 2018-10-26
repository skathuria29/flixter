const express = require('express');
const router = express.Router();
const url = require('url');
const passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
const sendEmail = require('../mailer');
const ensureAuth = require('./auth');

const User = require('../models/user');

router.get('/', ensureAuth, function(req, res, next){
    // let user = null;
    // if(req.user){ 
    //     user = {
    //         name : req.user.username,
    //         email : req.user.email
    //     }
    // }
    res.redirect('/home/browse');
    //res.render('/home/browse' , {title : 'MovieDB' , user : user});
});

function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		return next();
	} else {
        res.render('home' , {title : 'MovieDB', user : null})
	}
}

router.get('/login' , (req, res) =>{
   // let msg = req.query ? (req.query.reg_success ? req.query.reg_success : null ) : null;
    let messages = {
        success : req.flash('success') || [],
        error : req.flash('error') || [] 
    } 
    res.render('login' , { title : 'MovieDB' , info  : messages});
})

passport.use(new LocalStrategy(
	function (email, password, done) {
		User.getUserByEmail(email, function (err, user) {
			if (err) throw err;
			if (!user) {
				return done(null, false, { message: 'Unknown User' });
			}

			User.comparePassword(password, user.password, function (err, isMatch) {
				if (err) throw err;
				if (isMatch) {
					return done(null, user);
				} else {
					return done(null, false, { message: 'Invalid password' });
				}
			});
		});
	}));

passport.serializeUser(function (user, done) {
	done(null, user.id);
});

passport.deserializeUser(function (id, done) {
	User.getUserById(id, function (err, user) {
		done(err, user);
	});
});


router.post('/login',
  passport.authenticate('local', { failureRedirect: '/login' , failureFlash : true }),
  function(req, res) {
    res.redirect('home/browse');
  });

// router.post('/login',
//   //  passport.authenticate('local', { successRedirect: '/home/browse', failureRedirect: '/login', failureFlash: true })
//   passport.authenticate('local', (err, user, info) => {
//     if(err)
//         return res.redirect('/login');
//     else 
//         return res.redirect('/home/browse');
//   })
// ); 



router.get('/register' , (req, res) =>{
    res.render('register' , { title : 'MovieDB'});
})

router.post('/register' , (req, res) =>{
    //res.render('register' , { title : 'MovieDB'});
    let email = req.body.email;
    let username = req.body.username;
    let password = req.body.password;

    req.checkBody('username', 'Username is required').notEmpty();
	req.checkBody('email', 'Email is required').notEmpty();
	req.checkBody('email', 'Email is not valid').isEmail();
	req.checkBody('password', 'Password is required').notEmpty();
	

	var errors = req.validationErrors();

	if (errors) {
		res.render('register', {
			errors: errors
		});
    }
    else{
        //res.send

        User.findOne({ email: { 
                "$regex": "^" + email + "\\b", "$options": "i"
        }}, function (err, mail) {
           
            if (mail) {
                res.render('register', {
                    mail: mail,
                    title : 'MovieDB'
                    
                });
            }
            else{
                let new_user = new User({
                    email: email,
                    username: username,
                    password: password
                });
                
                User.registerUser(new_user, function (err, user) {
                    if (err) throw err;
                    const message = `Hi! ${new_user.username} <br>
                                    <b> Welcome to MovieDB </b>
                                    <p>Thanks for registering an account on The Movie Database (TMDb).
                                     We are excited to see you join the community!</p>
                                    `
                    //'Hi!' + new_user.username + '<br>' + 'Thanks for registering an account on The Movie Database (TMDb). We are excited to see you join the community!'
                    sendEmail(new_user.email, 'Welcome to MovieDB', message);
                    req.flash('success' ,'Succesfully registered! Sign In to continue.');
                    res.redirect('/login');
                });
                
            }

        })
    }
})

module.exports = router;


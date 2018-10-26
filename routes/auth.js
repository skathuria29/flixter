function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		return next();
	} else {
        res.render('home' , {title : 'MovieDB', user : null})
	}
}


module.exports = ensureAuthenticated;

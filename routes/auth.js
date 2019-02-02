const {APPNAME} = require('../config/settings');

function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		return next();
	} else {
		res.redirect("/login");
	//res.render('home' , {title : APPNAME, user : null})
	}
}


module.exports = ensureAuthenticated;

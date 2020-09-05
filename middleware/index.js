const middlewareObj = {};

// Logged in middleware
middlewareObj.isLoggedIn = function(req, res, next) {
	if(req.isAuthenticated()) {
		return next();
	}
	req.flash('error', 'You must be logged in to do that.')
	res.redirect('/register');
};

module.exports = middlewareObj;
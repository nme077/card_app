const middlewareObj = {};

// Logged in middleware
middlewareObj.isLoggedIn = function(req, res, next) {
	if(req.isAuthenticated()) {
		return next();
	}
	req.flash('error', 'You must be logged in to do that.')
	res.redirect('/register');
};

middlewareObj.allowedFileType = function(req, res, next) {
	const mimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/ief', 'image/pipeg', 'image/svg+xml', 'image/tiff'];

	if(mimeTypes.includes(req.file.mimetype)) {
		return next();
	}
	req.flash('error', 'File type not supported');
	res.redirect('back');
}

module.exports = middlewareObj;
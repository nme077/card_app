const middlewareObj = {};

// Logged in middleware
middlewareObj.isLoggedIn = function(req, res, next) {
	if(!req.isAuthenticated()) {
		req.session.returnTo = req.originalUrl;
		req.flash('error', 'You must be logged in to do that.')
		return res.redirect('/login');
	}

	return next();
};

middlewareObj.allowedFileType = function(req, res, next) {
	const mimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/ief', 'image/pipeg', 'image/svg+xml', 'image/tiff'];
	const maxPhotos = 12;

	if(mimeTypes.includes(req.file.mimetype)) {
		if(req.user.numOfPhotos >= maxPhotos) { // Update max photos number on photo gallery if changed
			req.flash('error', `Limit of ${maxPhotos} photos allowed, please delete some to make room for more!`);
			return res.redirect('back');
		}
		next();
	} else {
		req.flash('error', 'File type not supported');
		res.redirect('back');
	} 
}

module.exports = middlewareObj;
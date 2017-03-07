'use strict';

//Helper function
var avaliableProp = function(obj, prop){
	if (typeof obj[prop] !== 'undefined'){
		throw new Error ('Namespace conflict: ' + prop);
	}
}

var path = require('path');

avaliableProp(path, 'lvls');
path.lvls = require('./lvls.js');

avaliableProp(path, 'byDepth');
path.byDepth = require('./byDepth.js');

avaliableProp(path, 'ext');
path.ext = require('./ext.js');

avaliableProp(path, 'rmExt');
path.rmExt = require('./rmExt.js');

avaliableProp(path, 'dotfile');
path.dotfile = require('./dotfile.js');

module.exports = path;
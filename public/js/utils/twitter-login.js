var store = require('./store.js');
var settings = require('./../config/settings.js');

function TwitterLogin(options) {
	this.el = options.el;
	this.router = options.router;
	this.init();
}

TwitterLogin.prototype.init = function() {
	this.bindEvents();
};

TwitterLogin.prototype.bindEvents = function() {
	this.el.addEventListener('click', function(e) {
		var link = settings.twitterEndpoint;
		e.preventDefault();
		this.startLogin(link);
	}.bind(this));
};

TwitterLogin.prototype.startLogin = function(link) {
	var windowOptions = 'location=yes,closebuttoncaption=Done,presentationstyle=pagesheet,width=500,height=300';
	var ref = window.open(settings.apiURL + link, "_blank", windowOptions);
	var afterLogin = function() {
		store.set('route', window.location.pathname);
		this.router.navigate('/post-login', {
			trigger: true
		});
	}.bind(this);
	var timer = setInterval(function() {
		if (ref.closed) {
			clearInterval(timer);
			afterLogin();
		}
	}.bind(this), 100);
};

module.exports = TwitterLogin;
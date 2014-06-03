var Backbone = require('backbone');
var $ = require('jquery');
Backbone.$ = $;
var _ = require('lodash');

var settings = require('./../config/settings.js');
var swap = require('./../utils/swap-view.js');
var cookies = require('./../utils/cookies.js');

var regions = {};

var views = {
	sidebar: require('./../views/sidebar.js'),
	page: require('./../views/page.js'),
	app: require('./../views/app.js')
};

var collections = {};

var models = {};

var checkAuth = function(callback) {
	var xhr = $.ajax({
		url: settings.apiURL + "/api/check-auth",
		success: function(data) {
			if (xhr.status == 200) {
				callback(data);
			}
		},
		error: function() {
			if (xhr.status == 401) {
				callback(null);
			}
		}
	});
};

module.exports = Backbone.Router.extend({
	routes: {
		"": "jump",
		"home": "home",
		"post-login": "postLogin"
	},

	initialize: function(options) {
		checkAuth(function(data) {
			if (data) {
				this.user = new models.user(data);
			}
			this.initChrome();
			options.callback();
		}.bind(this));
	},

	currentUser: function() {
		return this.user || null;
	},

	initChrome: function() {
		regions.app = $('#app');
		regions.page = $('#page');
	},

	clearApp: function() {
		regions.app.empty();
	},

	clearPage: function() {
		regions.page.empty();
	},

	setupApp: function() {
		swap(regions.app, new views.app({
			router: this
		}));
	},

	setupPage: function() {
		swap(regions.page, new views.page({
			router: this
		}));
	},

	jump: function() {
		if (!this.currentUser()) {
			this.clearApp();
			this.setupPage();
		} else {
			this.clearPage();
			this.setupApp();
		}
	},

	home: function() {
		this.clearApp();
		this.setupPage();
	},

	logout: function() {
		var self = this;
		$.ajax({
			url: settings.apiURL + "/api/logout",
			success: function() {
				checkAuth(function(data) {
					if (data) {
						self.user = new models.user(data);
					} else {
						self.user = data;
					}
					self.navigate("/", {
						trigger: true
					});
					self.initChrome();
				});
			}
		});
	}

});
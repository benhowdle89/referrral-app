var Backbone = require('backbone');
var $ = require('jquery');
Backbone.$ = $;
var _ = require('lodash');

var settings = require('./../config/settings.js');
var swap = require('./../utils/swap-view.js');
var cookies = require('./../utils/cookies.js');
var store = require('./../utils/store.js');

var regions = {};

var views = {
	home: require('./../views/home.js'),
	profile: require('./../views/profile.js'),
	header: require('./../views/header.js')
};

var collections = {
	tags: require('./../collections/tags.js')
};

var models = {
	user: require('./../models/user.js')
};

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
		"jump": "jump",
		"home": "home",
		"post-login": "postLogin",
		"profile/:twitter": "profile",
		"logout": "logout"
	},

	initialize: function(options) {
		this.user = null;
		this.collections = {};
		checkAuth(function(data) {
			if (data) {
				this.user = new models.user(data);
			}
			this.populateData(function() {
				this.initChrome();
				options.callback();
			}.bind(this));
		}.bind(this));
	},

	currentUser: function() {
		return this.user || null;
	},

	initChrome: function() {
		regions.content = $('#content');
		regions.header = $('#header');
		this.renderHeader();
	},

	populateData: function(callback) {
		this.collections.tags = new collections.tags();
		this.collections.tags.fetch({
			success: callback
		});
	},

	renderHeader: function() {
		regions.header.html(new views.header({
			user: this.currentUser(),
			router: this,
			tags: this.collections.tags
		}).render().el);
	},

	getRecommendationsFrom: function(twitter, callback) {
		$.ajax({
			url: settings.apiURL + "/api/recommendations/from/" + twitter,
			success: callback
		});
	},

	profile: function(twitter) {
		var getUser = function(twitter, callback) {
			var user = this.currentUser();
			if (user && user.get('twitter') == twitter) {
				callback(user);
			} else {
				var profile_user = new models.user({
					twitter: twitter
				});
				profile_user.fetch({
					success: function(model) {
						callback(model);
					}
				});
			}
		}.bind(this);
		getUser(twitter, function(user) {
			this.getRecommendationsFrom(twitter, function(recommendations) {
				swap(regions.content, new views.profile({
					router: this,
					profile_user: user,
					user: this.currentUser(),
					recommendations: recommendations
				}));
			}.bind(this));
		}.bind(this));
	},

	postLogin: function() {
		this.navigate('jump', {
			trigger: true
		});
	},

	jump: function() {
		checkAuth(function(data) {
			if (data) {
				this.user = new models.user(data);
			}
			if (this.currentUser()) {
				this.navigate('profile/' + this.user.get('twitter'), {
					trigger: true
				});
			} else {
				this.navigate('home', {
					trigger: true
				});
			}
			this.initChrome();
		}.bind(this));
	},

	home: function() {
		swap(regions.content, new views.home({
			router: this
		}));
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
					self.initChrome();
					self.navigate("/home", {
						trigger: true
					});
				});
			}
		});
	}

});
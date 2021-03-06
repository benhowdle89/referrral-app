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
	header: require('./../views/header.js'),
	account: require('./../views/account.js'),
	search: require('./../views/search.js'),
	tag: require('./../views/tag.js'),
	footer: require('./../views/footer.js'),
	latest: require('./../views/latest.js'),
	faq: require('./../views/faq.js')
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
		"faq": "faq",
		"post-login": "postLogin",
		"profile/:twitter": "profile",
		"account": "account",
		"logout": "logout",
		"account-save": "jump",
		"search/:name": "search",
		"search": "jump",
		"tag/:name": "tag",
		"latest": "latest",
		"*path": "jump"
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
				this.on('route', this.resetScroll, this);
				options.callback();
			}.bind(this));
		}.bind(this));
		this.bind('route', this._pageView);
	},

	_pageView: function() {
		if (window.location.href.indexOf('referrral') == -1) {
			return;
		}
		var path = Backbone.history.getFragment();
		ga('send', 'pageview', {
			page: "/" + path
		});
	},

	currentUser: function() {
		return this.user || null;
	},

	resetScroll: function() {
		setTimeout(function() {
			window.scrollTo(0, 0);
		}, 0);
	},

	initChrome: function() {
		regions.content = $('#content');
		regions.header = $('#header');
		regions.footer = $('#footer');
		this.renderFooter();
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

	renderFooter: function() {
		regions.footer.html(new views.footer().render().el);
	},

	faq: function() {
		regions.content.html(new views.faq().render().el);
	},

	getTopUsers: function(callback) {
		$.ajax({
			url: settings.apiURL + "/api/users/top",
			success: callback
		});
	},

	getRecommendationsFrom: function(twitter, callback) {
		$.ajax({
			url: settings.apiURL + "/api/recommendations/from/" + twitter,
			success: callback
		});
	},

	getRecommendationsFor: function(twitter, callback) {
		$.ajax({
			url: settings.apiURL + "/api/recommendations/for/" + twitter,
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
					},
					error: function() {
						callback(null);
					}
				});
			}
		}.bind(this);
		getUser(twitter, function(user) {
			if (!user) {
				return this.navigate('jump', {
					trigger: true
				});
			}
			this.getRecommendationsFrom(twitter, function(recommendationsFrom) {
				this.getRecommendationsFor(twitter, function(recommendationsFor) {
					swap(regions.content, new views.profile({
						router: this,
						profile_user: user,
						user: this.currentUser(),
						recommendationsFrom: recommendationsFrom,
						recommendationsFor: recommendationsFor,
						tags: this.collections.tags
					}));
				}.bind(this));
			}.bind(this));
		}.bind(this));
	},

	search: function(name) {
		var self = this;
		$.ajax({
			url: settings.apiURL + "/api/search/" + name,
			success: function(results) {
				swap(regions.content, new views.search({
					router: self,
					user: self.currentUser(),
					tags: self.collections.tags,
					results: results
				}));
			},
			error: function() {
				swap(regions.content, new views.search({
					results: []
				}));
			}
		});
	},

	tag: function(name) {
		var self = this;
		$.ajax({
			url: settings.apiURL + "/api/tags/" + name,
			success: function(results) {
				swap(regions.content, new views.tag({
					router: self,
					user: self.currentUser(),
					tag: name,
					results: results
				}));
			}
		});
	},

	latest: function() {
		var self = this;
		$.ajax({
			url: settings.apiURL + "/api/latest",
			success: function(results) {
				swap(regions.content, new views.latest({
					user: self.currentUser(),
					latestRecommendations: results
				}));
			}
		});
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

	account: function() {
		if (!this.currentUser()) {
			this.navigate('home', {
				trigger: true
			});
		} else {
			swap(regions.content, new views.account({
				router: this,
				user: this.currentUser()
			}));
		}
	},

	home: function() {
		this.getTopUsers(function(users) {
			swap(regions.content, new views.home({
				router: this,
				users: users
			}));
		}.bind(this));
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
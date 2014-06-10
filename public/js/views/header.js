var Handlebars = require("hbsfy/runtime");
var HandlebarsHelpers = require('./../utils/template-helpers.js');
var Backbone = require('backbone');
var $ = require('jquery');
Backbone.$ = $;

var settings = require('./../config/settings.js');
var twitterLogin = require('./../utils/twitter-login.js');
var convertUser = require('./../utils/convert-user.js');

var searchInputView = require('./search-input.js');

module.exports = Backbone.View.extend({

	initialize: function(options) {
		this.router = options.router;
		this.user = options.user;
		this.tags = options.tags;
	},

	className: "header",

	events: {

	},

	setupTwitterLogins: function() {
		var twitterLogins = this.$('[data-twitter-login]');
		for (var i = twitterLogins.length - 1; i >= 0; i--) {
			var twLogin = twitterLogins[i];
			new twitterLogin({
				el: twLogin,
				router: this.router
			});
		}
	},

	renderAfter: function() {
		this.setupTwitterLogins();
		this.$('[data-region="search"]').html(new searchInputView({
			tags: this.tags,
			router: this.router
		}).render().el);
	},

	render: function() {
		var template = require('./../../../templates/_header.html');
		this.$el.html(template({
			user: convertUser(this.user)
		}));

		setTimeout(this.renderAfter.bind(this), 0);

		return this;
	}
});
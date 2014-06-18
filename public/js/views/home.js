var Handlebars = require("hbsfy/runtime");
var Backbone = require('backbone');
var $ = require('jquery');
Backbone.$ = $;

var twitterLogin = require('./../utils/twitter-login.js');

module.exports = Backbone.View.extend({

	initialize: function(options) {
		this.router = options.router;
		this.users = this.sortedUsers(options.users);
	},

	className: "home",

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

	sortedUsers: function(users) {
		return users.sort(function(a, b) {
			if (a.count < b.count) {
				return 1;
			}
			if (a.count > b.count) {
				return -1;
			}
			return 0;
		});
	},

	renderAfter: function() {
		this.setupTwitterLogins();
	},

	render: function() {
		var template = require('./../../../templates/_home.html');
		this.$el.html(template({
			users: this.users
		}));

		setTimeout(this.renderAfter.bind(this), 0);

		return this;
	}
});
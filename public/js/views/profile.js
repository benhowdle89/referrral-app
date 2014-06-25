var Handlebars = require("hbsfy/runtime");
var HandlebarsHelpers = require('./../utils/template-helpers.js');
var Backbone = require('backbone');
var $ = require('jquery');
Backbone.$ = $;

var recommendationsFromView = require('./recommendations-from.js');
var recommendationsForView = require('./recommendations-for.js');
var recommendUserView = require('./recommend-user.js');
var emailSendView = require('./email-send.js');

var settings = require('./../config/settings.js');
var twitterLogin = require('./../utils/twitter-login.js');
var convertUser = require('./../utils/convert-user.js');

module.exports = Backbone.View.extend({

	initialize: function(options) {
		this.router = options.router;
		this.profile_user = options.profile_user;
		this.user = options.user;
		this.recommendationsFrom = options.recommendationsFrom;
		this.recommendationsFor = options.recommendationsFor;
		this.tags = options.tags;
	},

	events: {
		"click [data-key='tag-summary']": "showRecommenders",
		"click [data-key='email-send']": "emailSend"
	},

	className: "profile-wrap animated fadeIn",

	isOwner: function() {
		return (this.user && (this.user.get('_id') == this.profile_user.get('_id')));
	},

	emailSend: function() {
		this.$('[data-region="email-send"]').html(new emailSendView({
			profile_user: this.profile_user
		}).render().el);
	},

	showRecommenders: function(e) {
		var $el = $(e.currentTarget);
		var wrap = $el.next('[data-key="recommenders"]');
		var children = wrap.children();
		wrap.show();

		function showCard(i) {
			setTimeout(function() {
				$(children[i]).removeClass('hidden').addClass('animated fadeIn');
			}, i * 100);
		}

		for (var i = 0; i < children.length; i++) {
			showCard(i);
		}

	},

	reRenderRecommendations: function() {
		this.router.getRecommendationsFor(this.profile_user.get('twitter'), function(recommendations) {
			this.recommendationsFor = recommendations;
			this.renderRecommendedFor();
		}.bind(this));
	},

	renderRecommendedFrom: function() {
		this.$("[data-region='recommendations-from']").html(new recommendationsFromView({
			recommendations: this.recommendationsFrom,
			isOwner: this.isOwner(),
			profile_user: this.profile_user
		}).render().el);
	},

	renderRecommendedFor: function() {
		this.$("[data-region='recommendations-for']").html(new recommendationsForView({
			recommendations: this.recommendationsFor,
			isOwner: this.isOwner(),
			profile_user: this.profile_user
		}).render().el);
		setTimeout(function() {
			this.$('[data-key="tag-summary"]:first').trigger('click');
		}.bind(this), 300);
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

	renderRecommendUser: function() {
		if (!this.user) {
			return;
		}
		var container = this.$('[data-region="recommend-user"]');
		container.html(new recommendUserView({
			profile_user: this.profile_user.toJSON(),
			user: this.user,
			tags: this.tags,
			parent: this
		}).render().el);
	},

	onRecommendUser: function() {

	},

	renderNoRecommendationsFrom: function() {
		var template = require('./../../../templates/_no-recommendations-from.html');
		this.$("[data-region='recommendations-from']").html(template({
			profile_user: this.profile_user.toJSON()
		}));
	},

	renderDiscover: function() {
		var template = require('./../../../templates/_discover.html');
		this.$("[data-region='recommendations-from']").html(template({
			profile_user: this.profile_user.toJSON()
		}));
	},

	catchImageErrors: function() {
		this.$('[data-avatar]').on('error', function(e) {
			$(this).attr('src', '/img/user.png');
		});
	},

	renderAfter: function() {
		if (this.recommendationsFrom.length) {
			this.renderRecommendedFrom();
		} else {
			if (this.isOwner()) {
				this.renderDiscover();
			} else {
				this.renderNoRecommendationsFrom();
			}
		}
		if (this.recommendationsFor.length) {
			this.renderRecommendedFor();
		}
		this.setupTwitterLogins();
		if (!this.isOwner()) {
			this.renderRecommendUser();
		}
		this.catchImageErrors();
	},

	render: function() {
		var template = require('./../../../templates/_profile.html');
		this.$el.html(template({
			profile_user: this.profile_user.toJSON(),
			owner: this.isOwner(),
			tags: this.tags.toJSON(),
			user: convertUser(this.user)
		}));

		setTimeout(this.renderAfter.bind(this), 0);

		return this;
	}
});
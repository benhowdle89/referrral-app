var Handlebars = require("hbsfy/runtime");
var HandlebarsHelpers = require('./../utils/template-helpers.js');
var Backbone = require('backbone');
var $ = require('jquery');
Backbone.$ = $;

var recommendationsFromView = require('./recommendations-from.js');
var recommendationsForView = require('./recommendations-for.js');
var recommendUserView = require('./recommend-user.js');
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
		"click [data-key='tag-summary']": "showRecommenders"
	},

	className: "profile-wrap",

	isOwner: function() {
		return (this.user && (this.user.get('_id') == this.profile_user.get('_id')));
	},

	showRecommenders: function(e) {
		var $el = $(e.currentTarget);
		$el.next('[data-key="recommenders"]').show();
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
		setTimeout(function(){
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
		if (!this.user.get('canRecommend')) {
			return;
		}
		if (this.isOwner()) {
			return;
		}
		var container = this.$('[data-region="recommend-user"]');
		container.html(new recommendUserView({
			user: this.profile_user.toJSON(),
			tags: this.tags,
			parent: this
		}).render().el);
	},

	onRecommendUser: function() {
		this.router.getRecommendationsFor(this.profile_user.get('twitter'), function(recommendationsFor) {
			this.recommendationsFor = recommendationsFor;
			this.render();
		}.bind(this));
	},

	renderAfter: function() {
		if (this.recommendationsFrom.length) {
			this.renderRecommendedFrom();
		}
		if (this.recommendationsFor.length) {
			this.renderRecommendedFor();
		}
		this.setupTwitterLogins();
		if (!this.isOwner()) {
			this.renderRecommendUser();
		}
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
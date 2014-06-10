var Handlebars = require("hbsfy/runtime");
var HandlebarsHelpers = require('./../utils/template-helpers.js');
var Backbone = require('backbone');
var $ = require('jquery');
Backbone.$ = $;

var recommendationsFromView = require('./recommendations-from.js');
var recommendationsForView = require('./recommendations-for.js');
var settings = require('./../config/settings.js');

module.exports = Backbone.View.extend({

	initialize: function(options) {
		this.router = options.router;
		this.profile_user = options.profile_user;
		this.user = options.user;
		this.recommendationsFrom = options.recommendationsFrom;
		this.recommendationsFor = options.recommendationsFor;
		this.tags = options.tags;
	},

	className: "profile-wrap",

	events: {
		"click [data-key='user-recommend']": "userRecommend"
	},

	userRecommend: function() {
		var self = this,
			tags = [];
		[].forEach.call(this.$('[data-key="user-tags"] :checked'), function(tag) {
			tags.push(tag.getAttribute('data-id'));
		});

		$.ajax({
			url: settings.apiURL + "/api/recommend-user",
			type: "POST",
			data: {
				tags: tags,
				recommendedID: this.profile_user.get('twitter')
			},
			success: function() {
				self.router.getRecommendationsFor(self.profile_user.get('twitter'), function(recommendationsFor){
					self.recommendationsFor = recommendationsFor;
					self.render.call(self);
				});
			}
		});
	},

	isOwner: function() {
		return (this.user && (this.user.get('_id') == this.profile_user.get('_id')));
	},

	renderRecommendedFrom: function() {
		this.$("[data-region='recommendations-from']").html(new recommendationsFromView({
			recommendations: this.recommendationsFrom,
			isOwner: this.isOwner()
		}).render().el);
	},

	renderRecommendedFor: function() {
		this.$("[data-region='recommendations-for']").html(new recommendationsForView({
			recommendations: this.recommendationsFor,
			isOwner: this.isOwner()
		}).render().el);
	},

	renderAfter: function() {
		if (this.recommendationsFrom.length) {
			this.renderRecommendedFrom();
		}
		this.renderRecommendedFor();
	},

	render: function() {
		var template = require('./../../../templates/_profile.html');
		this.$el.html(template({
			profile_user: this.profile_user.toJSON(),
			owner: this.isOwner(),
			tags: this.tags.toJSON()
		}));

		setTimeout(this.renderAfter.bind(this), 0);

		return this;
	}
});
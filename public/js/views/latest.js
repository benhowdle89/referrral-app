var Handlebars = require("hbsfy/runtime");
var HandlebarsHelpers = require('./../utils/template-helpers.js');
var Backbone = require('backbone');
var $ = require('jquery');
Backbone.$ = $;

module.exports = Backbone.View.extend({

	initialize: function(options) {
		this.user = options.user;
		this.latestRecommendations = this.sortRecommendations(options.latestRecommendations);
	},

	className: "latest animated fadeIn",

	catchImageErrors: function() {
		this.$('[data-avatar]').on('error', function(e) {
			$(this).attr('src', '/img/user.png');
		});
	},

	renderAfter: function() {
		this.catchImageErrors();
	},

	sortRecommendations: function(recommendations) {
		var sorted = {};
		recommendations.forEach(function(recommendation) {
			var keyName = recommendation.recommendedID._id + "|" + recommendation.recommenderID._id;
			if (!sorted[keyName]) {
				sorted[keyName] = {};
			}
			if (!sorted[keyName].tags) {
				sorted[keyName].tags = [];
			}
			sorted[keyName].recommenderID = recommendation.recommenderID;
			sorted[keyName].recommendedID = recommendation.recommendedID;
			sorted[keyName].tags.push(recommendation.tagId);
		});
		return sorted;
	},

	render: function() {
		var template = require('./../../../templates/_latest.html');
		this.$el.html(template({
			latestRecommendations: this.latestRecommendations
		}));

		setTimeout(this.renderAfter.bind(this), 0);

		return this;
	}
});
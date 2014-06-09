var Handlebars = require("hbsfy/runtime");
var HandlebarsHelpers = require('./../utils/template-helpers.js');
var Backbone = require('backbone');
var $ = require('jquery');
Backbone.$ = $;

module.exports = Backbone.View.extend({

	initialize: function(options) {
		this.recommendations = options.recommendations;
	},

	className: "recommendations-from",

	renderAfter: function() {

	},

	organizeRecommendations: function(recommendations) {
		var sorted = {};
		recommendations.forEach(function(recommendation) {
			if (!sorted[recommendation.tagId.name]) {
				sorted[recommendation.tagId.name] = [];
			}
			sorted[recommendation.tagId.name].push({
				user: recommendation.recommendedID
			});
		});
		return sorted;
	},

	render: function() {
		var template = require('./../../../templates/_recommendations-from.html'),
			recommendations = this.organizeRecommendations(this.recommendations);

		this.$el.html(template({
			recommendations: recommendations
		}));

		setTimeout(this.renderAfter.bind(this), 0);

		return this;
	}
});
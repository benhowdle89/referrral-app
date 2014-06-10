var Handlebars = require("hbsfy/runtime");
var HandlebarsHelpers = require('./../utils/template-helpers.js');
var Backbone = require('backbone');
var $ = require('jquery');
Backbone.$ = $;

var settings = require('./../config/settings.js');

module.exports = Backbone.View.extend({

	initialize: function(options) {
		this.recommendations = options.recommendations;
		this.isOwner = options.isOwner;
	},

	className: "recommendations-from",

	events: {
		"click [data-key='recommendation-delete']": "recommendationDelete"
	},

	recommendationDelete: function(e) {
		if (!this.isOwner) {
			return;
		}
		var $this = $(e.currentTarget),
			id = $this.attr('data-id');
		$.ajax({
			url: settings.apiURL + "/api/recommendation-delete/" + id,
			success: function() {
				$this.parents('[data-key="recommended-users"]').remove();
			}
		});
	},

	renderAfter: function() {

	},

	organizeRecommendations: function(recommendations) {
		var sorted = {};
		recommendations.forEach(function(recommendation) {
			if (!sorted[recommendation.tagId.name]) {
				sorted[recommendation.tagId.name] = [];
			}
			sorted[recommendation.tagId.name].push({
				user: recommendation.recommendedID,
				id: recommendation._id
			});
		});
		return sorted;
	},

	render: function() {
		var template = require('./../../../templates/_recommendations-from.html'),
			recommendations = this.organizeRecommendations(this.recommendations);

		this.$el.html(template({
			recommendations: recommendations,
			isOwner: this.isOwner
		}));

		setTimeout(this.renderAfter.bind(this), 0);

		return this;
	}
});
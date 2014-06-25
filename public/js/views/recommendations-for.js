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
		this.profile_user = options.profile_user;
	},

	className: "recommendations",

	events: {
		"click [data-key='recommendation-delete']": "recommendationDelete"
	},

	recommendationDelete: function(e) {
		if(!confirm('Are you sure you wish to remove this recommendation?')){
			return;
		}
		if (!this.isOwner) {
			return;
		}
		var $this = $(e.currentTarget),
			id = $this.attr('data-id');
		$.ajax({
			url: settings.apiURL + "/api/recommendation-delete/" + id,
			success: function() {
				var $el = $this.parents('[data-key="recommenders"]');
				$el.addClass('animated bounceOut');
				setTimeout(function(){
					$el.remove();
				}, 1000);
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
				tag: recommendation.tagId,
				user: recommendation.recommenderID,
				id: recommendation._id
			});
		});
		var sortedObj = {};
		Object.keys(sorted).sort(function(a, b) {
			return sorted[a].length < sorted[b].length;
		}).forEach(function(tag) {
			sortedObj[tag] = sorted[tag];
		});
		return sortedObj;
	},

	render: function() {
		var template = require('./../../../templates/_recommendations-for.html'),
			recommendations = this.organizeRecommendations(this.recommendations);

		this.$el.html(template({
			recommendations: recommendations,
			isOwner: this.isOwner,
			profile_user: this.profile_user.toJSON()
		}));

		setTimeout(this.renderAfter.bind(this), 0);

		return this;
	}
});
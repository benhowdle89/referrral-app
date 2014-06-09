var Handlebars = require("hbsfy/runtime");
var HandlebarsHelpers = require('./../utils/template-helpers.js');
var Backbone = require('backbone');
var $ = require('jquery');
Backbone.$ = $;

var recommendationsFromView = require('./recommendations-from.js');

module.exports = Backbone.View.extend({

	initialize: function(options) {
		this.router = options.router;
		this.profile_user = options.profile_user;
		this.user = options.user;
		this.recommendations = options.recommendations;
	},

	className: "profile-wrap",

	renderRecommendedFrom: function(){
		this.$("[data-region='recommendations-from']").html(new recommendationsFromView({
			recommendations: this.recommendations
		}).render().el);
	},

	renderAfter: function() {
		this.renderRecommendedFrom();
	},

	render: function() {
		var template = require('./../../../templates/_profile.html');
		this.$el.html(template({
			profile_user: this.profile_user.toJSON()
		}));

		setTimeout(this.renderAfter.bind(this), 0);

		return this;
	}
});
var Handlebars = require("hbsfy/runtime");
var HandlebarsHelpers = require('./../utils/template-helpers.js');
var Backbone = require('backbone');
var $ = require('jquery');
Backbone.$ = $;

var settings = require('./../config/settings.js');
var recommendUserView = require('./recommend-user.js');

module.exports = Backbone.View.extend({

	initialize: function(options) {
		this.tags = options.tags;
		this.user = options.user;
		this.results = options.results;
		this.router = options.router;
	},

	className: "search",

	renderSearchResults: function(results) {
		var template = require('./../../../templates/_search-result.html'),
			container = this.$('[data-region="search-results"]');
		this.results.forEach(function(result) {
			container.append(template({
				user: result
			}));
			this.renderRecommendUser(result);
		}.bind(this));
	},

	renderRecommendUser: function(user) {
		var container = this.$('[data-user="' + user.twitter + '"] [data-region="recommend-user"]');
		container.html(new recommendUserView({
			user: user,
			tags: this.tags,
			parent: this
		}).render().el);
	},

	onRecommendUser: function() {
		console.log('Recommended!');
	},

	renderAfter: function() {
		this.renderSearchResults();
	},

	render: function() {
		var template = require('./../../../templates/_search.html');
		this.$el.html(template());

		setTimeout(this.renderAfter.bind(this), 0);

		return this;
	}
});
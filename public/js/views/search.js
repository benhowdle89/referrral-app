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
			if (!this.user) {
				return;
			}
			if (this.user.get('twitter') == result.twitter) {
				return;
			}
			this.renderRecommendUser(result);
		}.bind(this));
	},

	renderRecommendUser: function(user) {
		var container = this.$('[data-user="' + user.twitter + '"] [data-region="recommend-user"]');
		container.html(new recommendUserView({
			profile_user: user,
			user: this.user,
			tags: this.tags,
			parent: this,
			onSearch: true
		}).render().el);
	},

	onRecommendUser: function() {
		console.log('Recommended!');
	},

	catchImageErrors: function() {
		this.$('[data-avatar]').on('error', function(e) {
			$(this).attr('src', '/img/user.png');
		});
	},

	renderAfter: function() {
		if (this.results.length) {
			this.renderSearchResults();
		}
		this.catchImageErrors();
	},

	render: function() {
		var template = require('./../../../templates/_search.html');
		this.$el.html(template({
			results: this.results.length
		}));

		setTimeout(this.renderAfter.bind(this), 0);

		return this;
	}
});
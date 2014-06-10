var Handlebars = require("hbsfy/runtime");
var HandlebarsHelpers = require('./../utils/template-helpers.js');
var Backbone = require('backbone');
var $ = require('jquery');
Backbone.$ = $;

var settings = require('./../config/settings.js');

module.exports = Backbone.View.extend({

	initialize: function(options) {
		this.tags = options.tags;
		this.user = options.user;
		this.results = options.results;
		this.router = options.router;
	},

	className: "search",

	events: {
		"click [data-key='user-recommend']": "recommendUser"
	},

	recommendUser: function(e) {
		var $this = $(e.currentTarget);
		var root = $this.parents('[data-key="search-result"]'),
			recommendedID = $this.attr('data-recommendedID');

		var tags = [];
		[].forEach.call(this.$('[data-key="user-tags"] :checked'), function(tag) {
			tags.push(tag.getAttribute('data-id'));
		});

		$.ajax({
			url: settings.apiURL + "/api/recommend-user",
			type: "POST",
			data: {
				tags: tags,
				recommendedID: recommendedID
			},
			success: function() {

			}
		});
	},

	renderSearchResults: function(results) {
		var template = require('./../../../templates/_search-result.html'),
			container = this.$('[data-region="search-results"]');
		this.results.forEach(function(result) {
			container.append(template({
				user: result,
				tags: this.tags.toJSON()
			}));
		}.bind(this));
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
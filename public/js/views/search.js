var Handlebars = require("hbsfy/runtime");
var HandlebarsHelpers = require('./../utils/template-helpers.js');
var Backbone = require('backbone');
var $ = require('jquery');
Backbone.$ = $;

var settings = require('./../config/settings.js');

module.exports = Backbone.View.extend({

	initialize: function(options) {

	},

	events: {
		"click [data-key='search-users']": "searchUsers"
	},

	searchUsers: function() {
		var self = this,
			name = this.$('#search-name').val();
		if (!name) {
			return;
		}
		$.ajax({
			url: settings.apiURL + "/api/search/" + name,
			success: function(results) {
				console.log(results);
			}
		});
	},

	renderAfter: function() {

	},

	render: function() {
		var template = require('./../../../templates/_search.html');
		this.$el.html(template());

		setTimeout(this.renderAfter.bind(this), 0);

		return this;
	}
});
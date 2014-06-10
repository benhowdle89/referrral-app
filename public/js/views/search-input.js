var Handlebars = require("hbsfy/runtime");
var HandlebarsHelpers = require('./../utils/template-helpers.js');
var Backbone = require('backbone');
var $ = require('jquery');
Backbone.$ = $;

var settings = require('./../config/settings.js');

module.exports = Backbone.View.extend({

	initialize: function(options) {
		this.tags = options.tags;
		this.router = options.router;
	},

	events: {
		"click [data-key='search-users']": "searchUsers",
		"keyup #search-name": function(e) {
			if (e.which == 13) {
				this.searchUsers();
			}
		}
	},

	searchUsers: function() {
		var self = this,
			name = this.$('#search-name').val();
		if (!name) {
			return;
		}
		this.router.navigate('/search/' + name, {
			trigger: true
		});
	},

	renderAfter: function() {

	},

	render: function() {
		var template = require('./../../../templates/_search-input.html');
		this.$el.html(template());

		setTimeout(this.renderAfter.bind(this), 0);

		return this;
	}
});
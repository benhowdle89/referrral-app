var Handlebars = require("hbsfy/runtime");
var HandlebarsHelpers = require('./../utils/template-helpers.js');
var Backbone = require('backbone');
var $ = require('jquery');
Backbone.$ = $;

var settings = require('./../config/settings.js');

module.exports = Backbone.View.extend({

	initialize: function(options) {
		this.tag = options.tag;
		this.user = options.user;
		this.results = options.results;
		this.router = options.router;
	},

	className: "tag",

	renderTagUsers: function(results) {
		var template = require('./../../../templates/_tag-user.html'),
			container = this.$('[data-region="tag-users"]');
		this.results.forEach(function(result) {
			container.append(template({
				user: result.recommendedID
			}));
		}.bind(this));
	},

	renderAfter: function() {
		this.renderTagUsers(this.results);
	},

	render: function() {
		var template = require('./../../../templates/_tag.html');
		this.$el.html(template({
			tag: this.tag
		}));

		setTimeout(this.renderAfter.bind(this), 0);

		return this;
	}
});
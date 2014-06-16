var Handlebars = require("hbsfy/runtime");
var HandlebarsHelpers = require('./../utils/template-helpers.js');
var Backbone = require('backbone');
var $ = require('jquery');
Backbone.$ = $;

module.exports = Backbone.View.extend({

	initialize: function(options) {
		this.tags = options.tags;
		this.profile_user = options.profile_user;
	},

	className: "tweet-recommendation-share",

	renderAfter: function() {
		
	},

	render: function() {
		var template = require('./../../../templates/_tweet-recommendation-share.html');
		this.$el.html(template({
			profile_user: this.profile_user,
			tags: this.tags
		}));

		setTimeout(this.renderAfter.bind(this), 0);

		return this;
	}
});
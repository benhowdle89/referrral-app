var Handlebars = require("hbsfy/runtime");
var HandlebarsHelpers = require('./../utils/template-helpers.js');
var Backbone = require('backbone');
var $ = require('jquery');
Backbone.$ = $;

module.exports = Backbone.View.extend({

	initialize: function(options) {
		
	},

	className: "faq",

	events: {

	},

	renderAfter: function() {
		
	},

	render: function() {
		var template = require('./../../../templates/_faq.html');
		this.$el.html(template({
			message: this.message
		}));

		setTimeout(this.renderAfter.bind(this), 0);

		return this;
	}
});
var Handlebars = require("hbsfy/runtime");
var HandlebarsHelpers = require('./../utils/template-helpers.js');
var Backbone = require('backbone');
var $ = require('jquery');
Backbone.$ = $;

module.exports = Backbone.View.extend({

	initialize: function(options) {
		this.message = options.message;
	},

	className: "notification animated bounceInDown",

	events: {

	},

	renderAfter: function() {
		setTimeout(function(){
			this.$el.addClass('fadeOut');
		}.bind(this), 2000);
	},

	render: function() {
		var template = require('./../../../templates/_notification.html');
		this.$el.html(template({
			message: this.message
		}));

		setTimeout(this.renderAfter.bind(this), 0);

		return this;
	}
});
var Handlebars = require("hbsfy/runtime");
var HandlebarsHelpers = require('./../utils/template-helpers.js');
var Backbone = require('backbone');
var $ = require('jquery');
Backbone.$ = $;


module.exports = Backbone.View.extend({

	initialize: function(options) {

	},

	className: "footer",

	events: {

	},

	renderAfter: function() {
	
	},

	render: function() {
		var template = require('./../../../templates/_footer.html');
		this.$el.html(template());

		setTimeout(this.renderAfter.bind(this), 0);

		return this;
	}
});
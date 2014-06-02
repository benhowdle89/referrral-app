var Handlebars = require("hbsfy/runtime");
var Backbone = require('backbone');
var $ = require('jquery');
Backbone.$ = $;

module.exports = Backbone.View.extend({
	render: function(){
		var template = require('./../../../templates/_sidebar.html');
		this.$el.html(template());
		return this;
	}
});

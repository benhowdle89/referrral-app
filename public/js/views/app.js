var Handlebars = require("hbsfy/runtime");
var Backbone = require('backbone');
var $ = require('jquery');
Backbone.$ = $;

module.exports = Backbone.View.extend({
	render: function(){
		var template = require('./../../../templates/_app.html');
		this.$el.html(template());
		return this;
	}
});

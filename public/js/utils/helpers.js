var Backbone = require('backbone');
var $ = require('jquery');
Backbone.$ = $;

module.exports = {

	s3URL: function(value) {
		return "https://s3-eu-west-1.amazonaws.com/" + value;
	}

};
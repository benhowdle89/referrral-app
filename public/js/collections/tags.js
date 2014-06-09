var Backbone = require('backbone');
var settings = require('./../config/settings.js');

module.exports = Backbone.Collection.extend({
	model: require('./../models/tag.js'),
	url: settings.apiURL + "/api/tags"
});
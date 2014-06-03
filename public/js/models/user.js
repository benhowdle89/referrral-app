var Backbone = require('backbone');
var settings = require('./../config/settings.js');

module.exports = Backbone.Model.extend({
	idAttribute: "twitter",
	urlRoot: settings.apiURL + "/api/users"
});
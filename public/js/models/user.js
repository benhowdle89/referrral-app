var Backbone = require('backbone');
var settings = require('./../config/settings.js');

module.exports = Backbone.Model.extend({
	idAttribute: "_id",
	urlRoot: settings.apiURL + "/api/users"
});
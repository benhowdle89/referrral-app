var Handlebars = require("hbsfy/runtime");
var moment = require('moment');
var _ = require('lodash');

Handlebars.registerHelper('inArray', function(value, array, options) {
	return (array.indexOf(value) > -1) ? options.fn(this) : options.inverse(this);
});

Handlebars.registerHelper('slug', function(value) {
	if (!value) {
		return "";
	}
	return value.replace(/\s+/g, "-").toLowerCase();
});

Handlebars.registerHelper('shortHumanDate', function(value) {
	return moment(value).format("HH:mm");
});

Handlebars.registerHelper('setIndex', function(value) {
	return (+value) + 1;
});

Handlebars.registerHelper('s3URL', function(value) {
	return "https://s3-eu-west-1.amazonaws.com/" + value;
});

Handlebars.registerHelper('isEqual', function(a, b, options) {
	return a == b ? options.fn(this) : options.inverse(this);
});

Handlebars.registerHelper('linkify', function(bio) {
	bio = bio.replace(/(\b(?:https?|ftp):\/\/[a-z0-9-+&@#\/%?=~_|!:,.;]*[a-z0-9-+&@#\/%=~_|])/ig, '<a target="_blank" data-no-hijack="true" href="$1">$1</a>');
	bio = bio.replace(/@([a-z\d_]+)/ig, '<a target="_blank" data-no-hijack="true" href="http://twitter.com/$1">@$1</a>');
	return bio;
});

Handlebars.registerHelper('human_tags', function(tags) {
	var last = tags.pop();
	return tags.join(', ') + " and " + last;
});
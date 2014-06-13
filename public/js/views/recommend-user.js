var Handlebars = require("hbsfy/runtime");
var Backbone = require('backbone');
var $ = require('jquery');
Backbone.$ = $;
var _ = require('lodash');
var select2 = require('select2');

var settings = require('./../config/settings.js');
var tagsCollection = require('./../collections/tags.js');

module.exports = Backbone.View.extend({

	initialize: function(options) {
		this.user = options.user;
		this.tags = options.tags;
		this.parent = options.parent;
	},

	className: "recommend-user",

	events: {
		"click [data-key='user-recommend']": "recommendUser",
	},

	recommendUser: function(e) {
		var $this = $(e.currentTarget),
			recommendedID = $this.attr('data-recommendedID'),
			tags = this.$('#tag-select-' + this.user.twitter).val();

		if(!tags.length){
			return;
		}

		$.ajax({
			url: settings.apiURL + "/api/recommend-user",
			type: "POST",
			data: {
				tags: tags,
				recommendedID: recommendedID
			},
			success: this.parent.onRecommendUser.bind(this.parent)
		});

	},

	setupSelect2: function() {
		this.$('#tag-select-' + this.user.twitter).select2({
			placeholder: "Start typing a tag name",
			width: "element"
		});
	},

	renderAfter: function() {
		this.setupSelect2();
	},

	render: function() {
		var template = require('./../../../templates/_recommend-user.html');
		this.$el.html(template({
			user: this.user,
			tags: this.tags.toJSON()
		}));

		setTimeout(this.renderAfter.bind(this), 0);

		return this;
	}
});
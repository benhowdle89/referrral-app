var Handlebars = require("hbsfy/runtime");
var Backbone = require('backbone');
var $ = require('jquery');
Backbone.$ = $;
var _ = require('lodash');

var settings = require('./../config/settings.js');
var tagsCollection = require('./../collections/tags.js');

module.exports = Backbone.View.extend({

	initialize: function(options) {
		this.user = options.user;
		this.tags = options.tags;
		this.parent = options.parent;
		this.selectedTags = new tagsCollection();
	},

	events: {
		"click [data-key='user-recommend']": "recommendUser",
		"keyup [name='tag-input']": "filterTags",
		"click [data-key='suggested-tag']": "selectTag"
	},

	selectTag: function(e) {
		var template = require('./../../../templates/_selected-tags.html'),
			tagId = e.currentTarget.getAttribute('data-tag-id'),
			tag = this.tags.findWhere({
				_id: tagId
			});

		this.selectedTags.add(tag);

		this.$('[data-region="selected-tags"]').html(template({
			tags: this.selectedTags.toJSON()
		}));

		this.$("[name='tag-input']").val('');
		this.filterTags();

	},

	filterTags: function() {
		var template = require('./../../../templates/_suggested-tags.html'),
			input = this.$("[name='tag-input']").val(),
			re = new RegExp("^" + input, "i"),
			tags = [];

		if (input) {
			tags = this.tags.filter(function(tag) {
				return re.test(tag.get('name'));
			});
		}

		this.$('[data-region="suggested-tags"]').html(template({
			tags: _.invoke(tags, 'toJSON')
		}));
	},

	recommendUser: function(e) {
		var $this = $(e.currentTarget),
			recommendedID = $this.attr('data-recommendedID');

		if(!this.selectedTags.length){
			return;
		}

		$.ajax({
			url: settings.apiURL + "/api/recommend-user",
			type: "POST",
			data: {
				tags: this.selectedTags.pluck("_id"),
				recommendedID: recommendedID
			},
			success: this.parent.onRecommendUser.bind(this.parent)
		});

	},

	renderAfter: function() {

	},

	render: function() {
		var template = require('./../../../templates/_recommend-user.html');
		this.$el.html(template({
			user: this.user
		}));

		setTimeout(this.renderAfter.bind(this), 0);

		return this;
	}
});
var Handlebars = require("hbsfy/runtime");
var Backbone = require('backbone');
var $ = require('jquery');
Backbone.$ = $;
var _ = require('lodash');
var select2 = require('select2');

var settings = require('./../config/settings.js');
var tagsCollection = require('./../collections/tags.js');
var convertUser = require('./../utils/convert-user.js');
var tweetRecommendationShareView = require('./tweet-recommendation-share.js');

module.exports = Backbone.View.extend({

	initialize: function(options) {
		this.profile_user = options.profile_user;
		this.user = options.user;
		this.tags = options.tags;
		this.parent = options.parent;
		this.onSearch = options.onSearch || false;
		this.selectedTags = [];
	},

	className: "recommend-user",

	events: {
		"click [data-key='user-recommend']": function(e) {
			$(e.currentTarget).find('i').attr('class', 'fa fa-circle-o-notch fa-spin');
			setTimeout(function() {
				this.recommendUser(e.currentTarget.getAttribute('data-recommendedID'));
			}.bind(this), 500);
		},
		"click [data-key='why-no-recommendation']": "displayExplanation",
		"click [data-key='close']": "closeExplanation"
	},

	displayExplanation: function() {
		this.$('[data-key="no-recommendation-explanation"]').show().addClass('animated fadeIn');
		this.$('[data-key="close"]').show().addClass('animated fadeIn');
	},

	closeExplanation: function(e) {
		$(e.currentTarget).parent().addClass('fadeOut');
		setTimeout(function() {
			this.remove();
		}.bind(this), 1000);
	},

	recommendUser: function(recommendedID) {

		this.selectedTags = this.$('#tag-select-' + this.profile_user.twitter).val();

		if (!this.selectedTags) {
			return;
		}

		$.ajax({
			url: settings.apiURL + "/api/recommend-user",
			type: "POST",
			data: {
				tags: this.selectedTags,
				recommendedID: recommendedID
			},
			success: this.onRecommendUser.bind(this)
		});

	},

	onRecommendUser: function() {
		var tags = _.pluck(_.invoke(this.tags.filter(function(tag) {
			return this.selectedTags.indexOf(tag.get('_id')) > -1;
		}.bind(this)), 'toJSON'), "name");
		this.$('.recommend-ui-wrap').addClass('animated bounceOut');

		setTimeout(function() {
			this.$('.recommend-ui-wrap').hide();
			this.$('[data-region="tweet-recommendation-share"]').html(new tweetRecommendationShareView({
				profile_user: this.profile_user,
				tags: tags,
				parent: this,
				onSearch: this.onSearch
			}).render().el);
		}.bind(this), 1000);

		if(this.parent.reRenderRecommendations){
			this.parent.reRenderRecommendations.call(this.parent);
		}

		this.selectedTags = [];
	},

	setupSelect2: function() {
		this.$('#tag-select-' + this.profile_user.twitter).select2({
			placeholder: "Start typing a tag name",
			// width: "element",
			// Add our 'needsclick' to each item, so FastClick doesn't get applied
			formatResult: function(result, container, query, escapeMarkup) {
				container.addClass('needsclick');
				return result.text;
			}
		});
	},

	renderAfter: function() {
		this.setupSelect2();
	},

	render: function() {
		var template = require('./../../../templates/_recommend-user.html');
		this.$el.html(template({
			profile_user: this.profile_user,
			user: convertUser(this.user),
			tags: this.tags.toJSON(),
			onSearch: this.onSearch
		}));

		setTimeout(this.renderAfter.bind(this), 0);

		return this;
	}
});
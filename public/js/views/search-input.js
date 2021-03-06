var Handlebars = require("hbsfy/runtime");
var HandlebarsHelpers = require('./../utils/template-helpers.js');
var Backbone = require('backbone');
var $ = require('jquery');
Backbone.$ = $;

var select2 = require('select2');

var settings = require('./../config/settings.js');

module.exports = Backbone.View.extend({

	initialize: function(options) {
		this.tags = options.tags;
		this.router = options.router;
	},

	events: {

	},

	setupSelect2: function() {
		var self = this;
		var mainSearchEl = this.$('#main-search');
		mainSearchEl.select2({
			// width: "element",
			placeholder: "Search for users or tags",
			formatNoMatches: function() {
				return "Hit enter to search users";
			},
			// Add our 'needsclick' to each item, so FastClick doesn't get applied
			formatResult: function(result, container, query, escapeMarkup) {
				container.addClass('needsclick');
				return result.text;
			}
		});
		mainSearchEl.on('change', function(e) {
			var val = e.val;
			if (val) {
				var tag = self.tags.findWhere({
					name: val
				});
				if (tag) {
					self.router.navigate('tag/' + val, {
						trigger: true
					});
				}
			}
		});
		this.$('.select2-search > input.select2-input').on('keyup', function(e) {
			if (e.keyCode === 13) {
				var val = $(this).val();
				if (val) {
					var tag = self.tags.findWhere({
						name: val
					});
					if (!tag) {
						self.router.navigate('search/' + val, {
							trigger: true
						});
						mainSearchEl.select2("close");
					}
				}
			}
		});
	},

	renderAfter: function() {
		this.setupSelect2();
	},

	render: function() {
		var template = require('./../../../templates/_search-input.html');
		this.$el.html(template({
			tags: this.tags.toJSON()
		}));

		setTimeout(this.renderAfter.bind(this), 0);

		return this;
	}
});
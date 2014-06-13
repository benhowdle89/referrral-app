var Handlebars = require("hbsfy/runtime");
var Backbone = require('backbone');
var $ = require('jquery');
Backbone.$ = $;

var convertUser = require('./../utils/convert-user.js');

module.exports = Backbone.View.extend({

	initialize: function(options) {
		this.router = options.router;
		this.user = options.user;
	},

	events: {
		"click [data-key='account-save']": "accountSave"
	},

	className: "account",

	accountSave: function() {
		var self = this,
			data = {};
		data.fullname = this.$('[name="fullname"]').val();
		data.bio = this.$('[name="bio"]').val();
		if(data.bio.length > 160){
			this.$('[name="bio"]').addClass('error');
			return;
		}
		data.location = this.$('[name="location"]').val();
		data.website = this.$('[name="website"]').val();
		this.user.save(data, {
			success: function() {
				self.router.navigate('/account-save', {
					trigger: true
				});
			}
		});
	},

	renderAfter: function() {

	},

	render: function() {
		var template = require('./../../../templates/_account.html');
		this.$el.html(template({
			user: convertUser(this.user)
		}));

		setTimeout(this.renderAfter.bind(this), 0);

		return this;
	}
});
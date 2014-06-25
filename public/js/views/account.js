var Handlebars = require("hbsfy/runtime");
var Backbone = require('backbone');
var $ = require('jquery');
Backbone.$ = $;

var notificationView = require('./notification.js');

var convertUser = require('./../utils/convert-user.js');

module.exports = Backbone.View.extend({

	initialize: function(options) {
		this.router = options.router;
		this.user = options.user;
	},

	events: {
		"click [data-key='account-save']": "accountSave"
	},

	className: "account animated fadeIn",

	accountSave: function() {
		var self = this,
			data = {};
		data.fullname = this.$('[name="fullname"]').val();
		if (!data.fullname) {
			this.$('[name="fullname"]').addClass('error');
			return;
		}
		data.bio = this.$('[name="bio"]').val();
		if (data.bio.length > 160) {
			this.$('[name="bio"]').addClass('error');
			return;
		}
		data.location = this.$('[name="location"]').val();
		data.website = this.$('[name="website"]').val();
		data.hire_me = !!this.$('[name="hire_me"]').is(':checked');
		data.email = this.$('[name="email"]').val();
		if (data.hire_me && !data.email) {
			this.$('[name="email"]').addClass('error');
			return;
		}
		if (!data.hire_me && data.email) {
			this.$('[name="hire_me"]').prev('label').addClass('error');
			return;
		}
		this.user.save(data, {
			success: function() {
				self.router.navigate('/account-save', {
					trigger: true
				});
				setTimeout(function() {
					$('[data-region="notification"]').html(new notificationView({
						message: "We made it. Your profile was saved successfully."
					}).render().el);
				}, 1500);
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
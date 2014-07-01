var Handlebars = require("hbsfy/runtime");
var Backbone = require('backbone');
var $ = require('jquery');
Backbone.$ = $;

var notificationView = require('./notification.js');

var settings = require('./../config/settings.js');
var convertUser = require('./../utils/convert-user.js');

module.exports = Backbone.View.extend({

	initialize: function(options) {
		this.router = options.router;
		this.user = options.user;
	},

	events: {
		"click [data-key='account-save']": "accountSave",
		"click [data-key='account-delete']": function() {
			if (confirm("Are you 100% positive you\'ve thought this through, there\'s no going back. No Delorean in sight...")) {
				this.accountDelete();
			}
		}
	},

	className: "account animated fadeIn",

	accountSave: function(e) {
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
		$(e.currentTarget).find('i').attr('class', 'fa fa-circle-o-notch fa-spin');
		this.user.save(data, {
			success: function() {
				setTimeout(function() {
					window.scrollTo(0, 0);
					$('[data-region="notification"]').html(new notificationView({
						message: "We made it. Your profile was saved successfully."
					}).render().el);
					self.render();
				}, 750);
			}
		});
	},

	accountDelete: function() {
		$.ajax({
			url: settings.apiURL + "/api/account/delete",
			type: "GET",
			success: function() {
				this.router.navigate('logout', {
					trigger: true
				});
			}.bind(this)
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
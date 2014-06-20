var Handlebars = require("hbsfy/runtime");
var HandlebarsHelpers = require('./../utils/template-helpers.js');
var Backbone = require('backbone');
var $ = require('jquery');
Backbone.$ = $;

var settings = require('./../config/settings.js');

module.exports = Backbone.View.extend({

	initialize: function(options) {
		this.profile_user = options.profile_user;
		this.sent = false;
	},

	events: {
		"click [data-key='email-send-submit']": function(e){
			$(e.currentTarget).find('i').attr('class', 'fa fa-circle-o-notch fa-spin');
			setTimeout(function(){
				this.sendEmail();
			}.bind(this), 1000);
		},
		"click [data-key='close']": "closeSuccess"
	},

	className: "email-send animated fadeInUp",

	closeSuccess: function(e) {
		$(e.currentTarget).parent().addClass('fadeOut');
		setTimeout(function(){
			this.remove();
		}.bind(this), 1000);
	},

	sendEmail: function() {
		var email = this.$('[name="email"]');
		var fullname = this.$('[name="fullname"]');
		var message = this.$('[name="message"]');
		var data = {};

		if (fullname.val()) {
			data.fullname = fullname.val();
		} else {
			fullname.addClass('error');
			return;
		}

		if (email.val()) {
			data.email = email.val();
		} else {
			email.addClass('error');
			return;
		}

		if (message.val()) {
			data.message = message.val();
		} else {
			message.addClass('error');
			return;
		}

		$.ajax({
			url: settings.apiURL + "/api/contact/" + this.profile_user.get('_id'),
			type: "POST",
			data: data,
			success: function() {
				this.$('[data-key="email-send-form"]').addClass('bounceOut');
				setTimeout(function() {
					this.sent = true;
					this.render();
				}.bind(this), 1000);
			}.bind(this)
		});

	},

	renderAfter: function() {

	},

	render: function() {
		var template = require('./../../../templates/_email-send.html');
		this.$el.html(template({
			profile_user: this.profile_user.toJSON(),
			sent: this.sent
		}));

		setTimeout(this.renderAfter.bind(this), 0);

		return this;
	}
});
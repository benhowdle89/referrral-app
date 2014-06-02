module.exports = function(region, newView) {

	function processExit(callback) {
		var oldView = region.view;
		if (oldView) {
			oldView.unbind();
			if (oldView.model) {
				oldView.model.unbind('change', oldView.render, oldView);
			}
			if (oldView.beforeExit) {
				oldView.beforeExit(function() {
					callback();
				});
			}

			oldView.remove();

			delete oldView.$el;
			delete oldView.el;

			callback();

		} else {
			callback();
		}
	}

	processExit(function() {
		region.view = newView;
		region.html(newView.render().el);
	});

};
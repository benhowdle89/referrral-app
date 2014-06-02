var Backbone = require('backbone');
var $ = require('jquery');
Backbone.$ = $;


var AppRouter = require('./routers/app-router.js');

function startApp() {
	var router = new AppRouter({
		callback: function() {
			Backbone.history.start({
				pushState: true
			});
			// Use absolute URLs to navigate to anything not in your Router.
			if (Backbone.history && Backbone.history._hasPushState) {

				$(document).on("click", "a[href]", function(evt) {
					if ($(this).attr('data-no-hijack') === undefined) {
						var href = $(this).attr("href").slice(1);
						evt.preventDefault();
						router.navigate(href, {
							trigger: true

						});
					}
				});

			}
		}
	});
}

startApp();

$(document).ready(function(){

  // specific toggle for overpanes
  $('[data-toggle-overpane]').click(function(e){
    e.preventDefault();
    var overpane = $(this).attr('data-toggle-overpane');
    overpane = $('[data-overpane-id='+overpane+']');
    $('.overlay').fadeToggle(200, function(){
      overpane.toggleClass('visible');
    });
  });

  // toggle based on dataattribute
  $('[data-toggle]').click(function(e){
    e.preventDefault();
    if($(this).is('[data-local-toggle]')) {
      var toggle = $(this).next($(this).attr('data-toggle'));
    }
    else {
      var toggle = $(this).attr('data-toggle');
      toggle = $(toggle);
    }
    toggle.slideToggle(200);
    if($(this).is('[data-toggle-class]')) {
      var classToggle = $(this).attr('data-toggle-class');
      $(this).toggleClass(classToggle);
    }
  });

  // toggling sidebar
  $('[data-toggle-menu]').on('click', function(e){
    e.preventDefault();
    $('.sidebar').toggleClass('on-canvas');
  });

  // loading features animation
  $('[data-action="load-features"]').on('click', function(e){
    e.preventDefault();
    $('.feature').each(function(index){
      var feature = $(this);
      window.setTimeout(function(){
        feature.removeClass('off-canvas').addClass('on-canvas');
      }, (index * 100));
    });
  });

  // Showing comment loading example
  $('[data-action="load-comments"]').on('click', function(e){
    e.preventDefault();
    loadComments();
  });

  $('.feature').on('click', function(e){
    e.preventDefault();
    $('.feature').each(function(index){
      var feature = $(this);
      window.setTimeout(function(){
        feature.removeClass('on-canvas').addClass('off-canvas');
      }, (index * 40));
    });
    window.setTimeout(function(){
      $('main.features').addClass('slide-off');
      $('main.comments').addClass('slide-off');
    }, 200);
    window.setTimeout(function(){
      $('main.comments').show().removeClass('slide-off').addClass('slide-on');
    }, 700);
    window.setTimeout(function(){
      loadComments();
    }, 1400);
  });


});

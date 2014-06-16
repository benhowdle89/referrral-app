var Backbone = require('backbone');
var $ = require('jquery');
Backbone.$ = $;

var AppRouter = require('./routers/app-router.js');

$.ajaxSetup({
  xhrFields: {
    withCredentials: true
  },
  crossDomain: true
});

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

$(document).on( 'error', '[data-avatar]', function( e ){
    $( this ).attr( 'src', '/img/user.png' );
});

startApp();
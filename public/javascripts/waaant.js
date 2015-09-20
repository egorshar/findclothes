require(['app/router'], function (AppRouter) {
  window.WNT = new AppRouter();
  Backbone.history.start({pushState: true});
});

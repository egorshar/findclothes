// app config
require.config({
  app_name: 'findclothes',
  baseUrl: '/javascripts/',
  shim: {
    'underscore': {
      exports: '_'
    },
    'backbone': {
      deps: ['underscore', 'jquery'],
      exports: 'Backbone'
    }
  },
  deps: ['app/router'],
  callback: function (AppRouter) {
    new AppRouter();

    Backbone.history.start({pushState: true});
  },
  paths: {
    jquery: 'vendor/jquery/dist/jquery',
    underscore: 'vendor/underscore/underscore',
    backbone: 'vendor/backbone/backbone',
    jade: 'vendor/jade/runtime'
  }
});

// app config
require.config({
  app_name: 'waaant',
  baseUrl: '/javascripts/',
  shim: {
    underscore: {
      exports: '_'
    },
    backbone: {
      deps: ['underscore', 'jquery'],
      exports: 'Backbone'
    },
  },
  paths: {
    jquery: 'vendor/jquery/dist/jquery',
    underscore: 'vendor/underscore/underscore',
    backbone: 'vendor/backbone/backbone',
    jade: 'vendor/jade/runtime',
    spin: 'vendor/spinjs/spin',
    ladda: 'vendor/ladda/dist/ladda.min',
    salvattore: 'vendor/salvattore/dist/salvattore',
  }
});

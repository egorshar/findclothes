// app config
var wnt_config = {
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
    steady: {
      exports: 'Steady',
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
    steady: 'vendor/steady/Steady',
    requirejs: 'vendor/requirejs/require',
    echojs: 'vendor/echojs/dist/echo',
  },
};

if (typeof module === 'object' && module.exports) {
  module.exports = wnt_config;
} else {
  require.config(wnt_config);
}

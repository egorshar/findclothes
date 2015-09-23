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
    salvattore: 'vendor/salvattore/dist/salvattore',
    steady: 'vendor/steady/Steady',
    requirejs: 'vendor/requirejs/require',
    parallax: 'vendor/scroll-parallax/dist/Parallax',
  },
};

if (typeof module === 'object' && module.exports) {
  module.exports = wnt_config;
} else {
  require.config(wnt_config);
}

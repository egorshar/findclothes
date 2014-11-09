var base_dir = __dirname + '/../',
    dest = "../public/build";

module.exports = {
  less: {
    src: base_dir + "public/stylesheets/less/**/*.less",
    dest: base_dir + 'public/stylesheets/'
  },
  jade: {
    src: base_dir + 'views/**.jade',
    dest: base_dir + 'public/javascripts/views/'
  }
};

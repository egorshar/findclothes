var base_dir = __dirname + '/../',
    dest = "../public/build";

console.log(base_dir);
module.exports = {
  // browserSync: {
  //   server: {
  //     // We're serving the src folder as well
  //     // for sass sourcemap linking
  //     baseDir: [dest, src]
  //   },
  //   files: [
  //     dest + "/**",
  //     // Exclude Map files
  //     "!" + dest + "/**.map"
  //   ]
  // },
  // sass: {
  //   src: src + "/sass/*.{sass, scss}",
  //   dest: dest
  // },
  // images: {
  //   src: src + "/images/**",
  //   dest: dest + "/images"
  // },
  // markup: {
  //   src: src + "/htdocs/**",
  //   dest: dest
  // },
  // browserify: {
  //   // Enable source maps
  //   debug: true,
  //   // Additional file extentions to make optional
  //   extensions: ['.coffee', '.hbs'],
  //   // A separate bundle will be generated for each
  //   // bundle config in the list below
  //   bundleConfigs: [{
  //     entries: src + '/javascript/app.coffee',
  //     dest: dest,
  //     outputName: 'app.js'
  //   }, {
  //     entries: src + '/javascript/head.coffee',
  //     dest: dest,
  //     outputName: 'head.js'
  //   }]
  // }
  less: {
    src: base_dir + "public/stylesheets/less/**/*.less",
    dest: base_dir + 'public/stylesheets/'
  },
  jade: {
    src: base_dir + 'views/**.jade',
    dest: base_dir + 'public/javascripts/views/'
  }
};

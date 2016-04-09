module.exports = function(config) {
  config.set({
    browsers: ['PhantomJS'],
    frameworks: ['jasmine'],
    files: [
      'dist/bower_components/angular/angular.js',
      'dist/bower_components/angular-mocks/angular-mocks.js',
      
      'src/js/**/*.js',
      'tests/js/**/*.spec.js'
    ]
  });
};
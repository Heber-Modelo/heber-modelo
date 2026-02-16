// BOROWY, Dziad. How to minify multiple Javascript files in a folder with UglifyJS.
// Postado em: 9 jun. 2013 [site]. Disponível em: <https://stackoverflow.com/questions/17008472>.
// Acesso em: 25 set. 2024.

module.exports = function (grunt) {
  grunt.initConfig({
    uglify: {
      files: {
        src: "src/main/resources/static/javascript/*.js",
        dest: "src/main/resources/static/javascript",
        expand: true,
        flatten: true,
        ext: ".js",
      },
    },
    watch: {
      js: { files: "src/main/resources/static/javascript/*.js", tasks: ["uglify"] },
    },
  });

  grunt.loadNpmTasks("grunt-contrib-watch");
  grunt.loadNpmTasks("grunt-contrib-uglify");
  grunt.registerTask("default", ["uglify"]);
};

module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      options:{
        //seperator (possibly need comma)
        seperator: ';'
      },
      client:{
        src:['public/client/*.js'],
        dest: 'dist/concatclient.js'
        //files we want to concatenate
      },
      lib:{
        src:['public/lib/*.js'],
        dest: 'dist/concatlib.js'
      }
    },

    mochaTest: {
      test: {
        options: {
          reporter: 'spec'
        },
        src: ['test/**/*.js']
      }
    },

    nodemon: {
      dev: {
        script: 'server.js'
      }
    },

    //Need clarity on the structure of uglify command (object, containing an array, containing dest + src files)
    uglify: {
      options: {},
      dist:{
        files:[
          {
            'dist/uglyclient.js': ['dist/concatclient.js'],
            'dist/uglylib.js': ['dist/concatlib.js']
          }
        ]
      }, 
    },

    jshint: {
      files: [
        // Add filespec list here
        'dist/concatclient.js'
      ],
      options: {
        force: 'true',
        jshintrc: '.jshintrc',
        ignores: [
          'public/lib/**/*.js',
          'public/dist/**/*.js'
        ]
      }
    },

    cssmin: {
      target:{
        files:
          [{
            src:['public/style.css'],
            dest:'dist/style.min.css'
          }]
      }
    },

    watch: {
      scripts: {
        files: [
          'public/client/**/*.js',
          'public/lib/**/*.js',
        ],
        tasks: [
          'concat',
          'uglify'
        ]
      },
      css: {
        files: 'public/*.css',
        tasks: ['cssmin']
      }
    },
    //used to run a cron task
    shell: {
      prodServer: {
        command: 'git push heroku master'

      }
    },
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-nodemon');

  grunt.registerTask('server-dev', function (target) {
    // Running nodejs in a different process and displaying output on the main console
    var nodemon = grunt.util.spawn({
         cmd: 'grunt',
         grunt: true,
         args: 'nodemon'
    });
    nodemon.stdout.pipe(process.stdout);
    nodemon.stderr.pipe(process.stderr);

    grunt.task.run([ 'watch' ]);
  });

  ////////////////////////////////////////////////////
  // Main grunt tasks
  ////////////////////////////////////////////////////

  grunt.registerTask('test', [
    'mochaTest'
  ]);

  grunt.registerTask('build', [
    'concat',
    'jshint',
    'uglify',
    'cssmin'
  ]);

  grunt.registerTask('production', [
    'test',
    'build',
    'shell'
  ]);

  grunt.registerTask('localserver', [
    'test',
    'build',
    ])


  grunt.registerTask('upload', function(n) {
    if(grunt.option('prod')) {
      // add your production server task here
      'shell'
      console.log('Pushed to Heroku');

    } else {
      grunt.task.run([ 'server-dev' ]);
    }
  });

  grunt.registerTask('deploy', [

    // add your deploy tasks here
    'test',
    'build',
    'shell'
  ]);

  // grunt.registerTask('deploy', function(n){
  //   if (grunt.option('production')){
  //     'production'
  //   };
  //   if (grunt.option('localserver')){
  //     'localserver',
  //     'server-dev'
  //   }
  // });


};

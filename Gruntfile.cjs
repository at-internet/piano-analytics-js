const fs = require('fs');
"use strict";

module.exports = function (grunt) {
    grunt.initConfig({
        copy: {
            "http-clean": {
                src: 'src/utils/request/http-template.js',
                dest: 'src/utils/request/http.js'
            },
            "http-node": {
                src: 'src/utils/request/http-node.js',
                dest: 'src/utils/request/http.js'
            },
            "http-browser": {
                src: 'src/utils/request/http-browser.js',
                dest: 'src/utils/request/http.js'
            },
            "http-browser-es5": {
                src: 'src/utils/request/http-browser.es5.js',
                dest: 'src/utils/request/http.js'
            },
            "http-react-native": {
                src: 'src/utils/request/http-react-native.js',
                dest: 'src/utils/request/http.js'
            },
        },
        concat: {
            es5polyfills: {
                src: ['polyfills/core-js-bundle-3.6.4.min.js', 'dist/browser/piano-analytics.es5.js'],
                dest: 'dist/browser/piano-analytics.es5.js',
            },
        },
    });
    grunt.registerTask('get-version', 'Copy version to the configuration', function() {
        try {
            const packageJsonVersion = JSON.parse(fs.readFileSync('./package.json', 'utf8')).version;
            let configFile = fs.readFileSync('./src/config.js', 'utf8');
            configFile = configFile.replace(/'version': '.*'/,`'version': '${packageJsonVersion}'`);
            fs.writeFileSync('./src/config.js', configFile);
        } catch (err) {
            console.error(err);
            process.exit(1);
        }
    });
    grunt.registerTask('remove-version', 'Remove version from default configuration', function() {
        try {
            const packageJsonVersion = JSON.parse(fs.readFileSync('./package.json', 'utf8')).version;
            let configFile = fs.readFileSync('./src/config.js', 'utf8');
            configFile = configFile.replace(/'version': '.*'/,`'version': ''`);
            fs.writeFileSync('./src/config.js', configFile);
        } catch (err) {
            console.error(err);
            process.exit(1);
        }
    });
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-concat');
};

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
                src: ['polyfills/core-js-bundle-3.6.5.min.js', 'dist/browser/piano-analytics.es5.js'],
                dest: 'dist/browser/piano-analytics.es5.js',
            },
        },
    });
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-concat');
};

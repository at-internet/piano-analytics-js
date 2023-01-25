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
            "http-react-native": {
                src: 'src/utils/request/http-react-native.js',
                dest: 'src/utils/request/http.js'
            },
        }
    });
    grunt.loadNpmTasks('grunt-contrib-copy');
};

"use strict";

module.exports = function (grunt) {
    grunt.initConfig({
        copy: {
            clean: {
                src: 'src/utils/request/http-template.js',
                dest: 'src/utils/request/http.js'
            },
            browserless: {
                src: 'src/utils/request/http-browserless.js',
                dest: 'src/utils/request/http.js'
            },
            browser: {
                src: 'src/utils/request/http-browser.js',
                dest: 'src/utils/request/http.js'
            },
        }
    });
    grunt.loadNpmTasks('grunt-contrib-copy');
};

"use strict";

module.exports = function (grunt) {
    grunt.initConfig({
        copy: {
            "http-clean": {
                src: 'src/utils/request/http-template.js',
                dest: 'src/utils/request/http.js'
            },
            "http-browserless": {
                src: 'src/utils/request/http-browserless.js',
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
            "datalayer-clean": {
                src: 'src/business/data-layer/data-layer-template.js',
                dest: 'src/business/data-layer/data-layer.js',
            },
            "datalayer-browserless": {
                src: 'src/business/data-layer/data-layer-template.js',
                dest: 'src/business/data-layer/data-layer.js'
            },
            "datalayer-browser": {
                src: 'src/business/data-layer/data-layer-browser.js',
                dest: 'src/business/data-layer/data-layer.js'
            },
        }
    });
    grunt.loadNpmTasks('grunt-contrib-copy');
};

process.env.CHROME_BIN = require('puppeteer').executablePath();
module.exports = function (config) {
    config.set({
        basePath: '',
        browserDisconnectTimeout: 5000,
        frameworks: ['mocha', 'chai'],
        plugins: [
            'karma-*'
        ],
        client: {
            mocha: {
                timeout: 5000,
            }
        },
        files: [
            'dist/browser/piano-analytics.js',
            'test/utils.js',
            'test/shared/*.js',
            'test/browser/*.js'
        ],
        exclude: [
            '*_bak_*'
        ],
        colors: true,
        logLevel: config.LOG_ERROR,
        autoWatch: true,
        browsers: ['ChromeHeadless'],
        captureTimeout: 60000,
        processKillTimeout: 4000,
        singleRun: true
    });
};

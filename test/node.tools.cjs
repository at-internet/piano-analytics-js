const pianoAnalytics = require('../dist/browserless/piano-analytics.cjs').pianoAnalytics;
const expect = require('chai').expect;

global.pa = pianoAnalytics;
global.expect = expect;

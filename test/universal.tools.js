const PianoAnalytics = require('../dist/universal/piano-analytics.js');
const expect = require('chai').expect;

global.pa = new PianoAnalytics();
global.expect = expect;

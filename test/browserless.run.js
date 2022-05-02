let Mocha = require('mocha'),
    fs = require('fs'),
    path = require('path');
let mocha = new Mocha({
    timeout: 5000
});
mocha.addFile('test/utils.js');
mocha.addFile('test/browserless.tools.js');
let testDirShared = 'test/shared';
let testDirBrowserless = 'test/browserless';
fs.readdirSync(testDirShared).forEach(function (file) {
    mocha.addFile(
        path.join(testDirShared, file)
    );
});
fs.readdirSync(testDirBrowserless).forEach(function (file) {
    mocha.addFile(
        path.join(testDirBrowserless, file)
    );
});
mocha.run(function (failures) {
    process.exitCode = failures ? 1 : 0;
});

let Mocha = require('mocha'),
    fs = require('fs'),
    path = require('path');
let mocha = new Mocha({
    timeout: 5000
});
mocha.addFile('test/utils.js');
mocha.addFile('test/universal.tools.js');
let testDirShared = 'test/shared';
let testDirUniversal = 'test/universal';
fs.readdirSync(testDirShared).forEach(function (file) {
    mocha.addFile(
        path.join(testDirShared, file)
    );
});
fs.readdirSync(testDirUniversal).forEach(function (file) {
    mocha.addFile(
        path.join(testDirUniversal, file)
    );
});
mocha.run(function (failures) {
    process.exitCode = failures ? 1 : 0;
});

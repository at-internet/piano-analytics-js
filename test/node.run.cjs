let Mocha = require('mocha'),
    fs = require('fs'),
    path = require('path');
let mocha = new Mocha({
    timeout: 5000
});
mocha.addFile('test/utils.cjs');
mocha.addFile('test/node.tools.cjs');
let testDirShared = 'test/shared';
let testDirNode = 'test/node';
fs.readdirSync(testDirShared).forEach(function (file) {
    mocha.addFile(
        path.join(testDirShared, file)
    );
});
fs.readdirSync(testDirNode).forEach(function (file) {
    mocha.addFile(
        path.join(testDirNode, file)
    );
});
mocha.run(function (failures) {
    process.exitCode = failures ? 1 : 0;
});

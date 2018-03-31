const fs = require('fs');

module.exports = function(fileName) {
    try {
        return fs.lstatSync(fileName);
    } catch (e) {
        return null;
    }
};

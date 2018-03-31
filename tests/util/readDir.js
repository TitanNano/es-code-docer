const { promisify } = require('util');
const path = require('path');
const fs = require('fs');

/** @type {fs.lstat} */
const lstat = promisify(fs.lstat);

/** @type {fs.readdir} */
const readdirNative = promisify(fs.readdir);

const readDir = function(dirPath) {
    return readdirNative(dirPath).then(files =>
        Promise.all(files.map(file => {
            const itemPath = path.join(dirPath, file);

            return lstat(itemPath).then(info => {
                if (info.isDirectory()) {
                    return readDir(itemPath);
                }

                return itemPath;
            });
        }))
    ).then(files =>
        files.reduce((sum, next) =>
            (Array.isArray(next) ? sum.push(...next) : sum.push(next)) && sum, []));
};

module.exports = readDir;

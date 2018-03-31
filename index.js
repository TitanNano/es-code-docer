const fs = require('fs');
const path = require('path');
const analyze = require('./lib/analyze');
const renderMd = require('./lib/renderMd');
const linkModules = require('./lib/linkModules');

const args = process.argv.slice(2);

const sourceCodeDirList = args.map(arg => path.resolve(process.cwd(), arg));
const sourceFiles = [];
const options = { title: false, noImports: true, onlyExports: true, out: 'out/' };
let isDirectory = false;

const readDir = function(dirPath) {
    return fs.readdirSync(dirPath).map(file => {
        const itemPath = path.join(dirPath, file);

        if (fs.lstatSync(itemPath).isDirectory()) {
            return readDir(itemPath);
        }

        return itemPath;
    }).reduce((sum, next) =>  (Array.isArray(next) ? sum.push(...next) : sum.push(next)) && sum, []);
};

sourceCodeDirList.forEach(sourceCodeDir => {
    try {
        isDirectory = fs.lstatSync(sourceCodeDir).isDirectory();
    } catch (e) {
        console.error('unable to read file info for', sourceCodeDir, 'It most likely doesn\'t exist.');

        return;
    }

    if (!isDirectory) {
        sourceFiles.push(sourceCodeDir);

        return;
    }

    sourceFiles.push(...readDir(sourceCodeDir));
});

const modules = sourceFiles.map(file => analyze(file));

linkModules(modules);

try {
    const isDirectory = fs.lstatSync(options.out).isDirectory();

    if (!isDirectory) {
        throw 'not a directory';
    }
} catch (e) {
    fs.mkdirSync(options.out);
}

const mdResult = renderMd(modules, options);

mdResult.forEach(module => {
    fs.writeFileSync(`out/${module.name}.md`, module.content, 'utf8');
});

/* eslint-env mocha */
const { expect } = require('chai');
const { promisify } = require('util');
const childProcess = require('child_process');
const readDir = require('./util/readDir');
const fs = require('fs');

/** @type {childProcess.exec} */
const exec = promisify(childProcess.exec);

/** @type {fs.readFile} */
const readFile = promisify(fs.readFile);

const getModuleDoc = function(module) {
    return readFile(`${__dirname}/out/Module:-tests::data::${module}.md`, 'utf8')
        .then(fileContent => {
            return fileContent.split('\n');
        });
};

describe('generating example documentation', () => {
    it('should emit 4 files', () => {
        return exec(`cd ${__dirname} && rm -fr out/ && node ../index.js data/`)
            .catch(error => console.error(error))
            .then(() => readDir(`${__dirname}/out/`))
            .then(fileList => {
                expect(fileList).to.have.lengthOf(4);
            });
    });

    it('top level declaration titles should be h1', () => {
        return getModuleDoc('module-1').then(fileContent => {
            expect(fileContent[0].indexOf('# ')).to.be.eq(0);
        });
    });

    it('object properties should be at least h2', () => {
        return getModuleDoc('module-1').then(fileContent => {
            expect(fileContent[7].indexOf('## Properties')).to.be.eq(0);
        });
    });

    it('method signature should contain all arguments', () => {
        return getModuleDoc('module-1').then(fileContent => {
            expect(fileContent[52]).to.contain('### navigate(url, replace)');
        });
    });

    it('method signature should contain return type', () => {
        return getModuleDoc('module-1').then(fileContent => {
            expect(fileContent[52]).to.contain('=> {State}');
        });
    });

    it('method param should contain name, type and description', () => {
        return getModuleDoc('module-1').then(fileContent => {
            expect(fileContent[60]).to.contain('| url |');
            expect(fileContent[61]).to.contain('| replace |');
            expect(fileContent[60]).to.contain('| [string](');
            expect(fileContent[61]).to.contain('| determines if the current document should be replaced |');
        });
    });

    it('types should link to their definition', () => {
        return getModuleDoc('module-1').then(fileContent => {
            expect(fileContent[44]).to.contain('[Document](./Module:-tests::data::module-1#document)');
        });
    });

    it('imported types should link to their original declaration', () => {
        return getModuleDoc('module-2').then(fileContent => {
            expect(fileContent[2]).to.contain('[Document](./Module:-tests::data::module-1#document)');
            expect(fileContent[11]).to.contain('[Document](./Module:-tests::data::module-1#document)');
        });
    });

    it('should correctly link re-exported types', () => {
        return getModuleDoc('module-3').then(fileContent => {
            expect(fileContent[2]).to.contain('[Document](./Module:-tests::data::module-1#document)');
            expect(fileContent[10]).to.contain('[Document](./Module:-tests::data::module-1#document)');
        });
    });

    it('should correctly link default exports', () => {
        return getModuleDoc('module-4').then(fileContent => {
            expect(fileContent[2]).to.contain('[Data](./Module:-tests::data::module-3#data)');
        });
    });

    it('should detect variables as functions if a parameter is set', () => {
        return getModuleDoc('module-4').then(fileContent => {
            expect(fileContent[13]).to.contain('**kind:** function');
        });
    });

    it('should mark private declarations', () => {
        return getModuleDoc('module-1').then(fileContent => {
            expect(fileContent[17]).to.contain('🚫 property');
            expect(fileContent[44]).to.contain('🚫 create()');
        });
    });

    it('should mark deprecated declarations', () => {
        return getModuleDoc('module-1').then(fileContent => {
            expect(fileContent[33]).to.contain('~~list~');
            expect(fileContent[25]).to.contain('~~currentNode~~');
        });
    });
});

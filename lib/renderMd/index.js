const resolveType = require('../resolveType');
const path = require('path');

const mdCleanString = function(string) {
    return string.replace(/^[ \t]*/g, '')
        .replace(/\n[ \t]*/g, '\n')
        .replace(/\s*\\\n/g, '')
        .replace(/(\\\\_\\\\_|\\_\\_|__)/g, '\\_\\_')
        .replace(/\\\\/, '\\')
        .replace(/\n/g, '  \n');
};

const mdResolveFileName = function(fileName) {
    return `Module:-${path.dirname(fileName).replace('/', '::')}::${path.basename(fileName, '.js')}`;
};

const md = function(textBlocks, ...values) {
    const READ_TEXT = Symbol('READ_TEXT');
    const READ_VALUE = Symbol('READ_VALUE');
    let readMode = READ_TEXT;
    let content = '';

    textBlocks = textBlocks.raw.slice();

    while (textBlocks.length || values.length) {
        if (readMode === READ_TEXT) {
            const value = textBlocks.shift();

            content += mdCleanString(value);

            if (values.length) {
                readMode = READ_VALUE;
            }

            continue;
        }

        if (readMode === READ_VALUE) {
            const value  = values.shift();

            content += mdCleanString(String(value));

            if (textBlocks.length) {
                readMode = READ_TEXT;
            }
        }
    }

    return content;
};

const renderTitle = function(moduleName, options) {
    if (!options.title) {
        return '';
    }

    return `# ${moduleName}
    `;
};

const renderModule = function(module, options) {
    return md`${renderTitle(module.name, options)}\
    ${renderDefinitions(module, options)}`;
};

const renderDefinitions = function(module, options) {
    const definitions = Array.from(module.definitions);

    return definitions.filter(def => {
        if (def.kind === 'import' && def.export) {
            def.name = def.export;

            return true;
        }

        if (options.onlyExports && !def.export && !def.used) {
            return false;
        }

        if (options.noImports && def.kind === 'import' && !def.export) {
            return false;
        }

        return true;
    }).reduce((sum, next) =>
        md`${sum}${renderDefinition(next, module, options.title ? '#' : '')}`, '');
};

const renderDefinition = function(definition, module, level = '#') {

    const isPrivate = definition.private ? '🚫 ' : '';
    const title = definition.name + renderFunctionSignature(definition, module);
    const titleDeprecated = renderDeprecated(title, definition);
    const origin = `**Origin:** ${definition.origin}\n`;

    return md`${level}# ${isPrivate}${titleDeprecated}

    ${definition.type ? `**Type:** ${resolveType(definition.type, module, mdResolveFileName)}\n` : ''}\
    ${definition.export ? `**exported:** ${definition.export}\n` : ''}\
    ${definition.origin ? origin : ''}\
    ${definition.kind ? `**kind:** ${definition.kind}\n` : ''}\
    ${definition.declaration ? `**declaration:** ${definition.declaration}\n` : ''}\

    ${definition.description || ''}\

    ${renderParams(definition.params, module)}\
    ${renderProperties(definition.properties, module, `${level}#`)}\
    ${renderMethods(definition.properties, module, `${level}#`)}\

    `;
};

const renderParams = function(params, module) {
    if (!params || !params.length) {
        return '';
    }

    return md`
            | Name | Type | Description |
            |------|------|-------------|
            ${params.map(param =>
        `| ${param.name} | ${resolveType(param.type, module, mdResolveFileName)} | ${param.description || ' '} |`)
        .join('\n')}\n`;
};

const renderProperties = function(properties, module, level = '##') {
    if (!properties || !properties.length) {
        return '';
    }

    return `${level}# Properties

    ${properties
        .filter(prop => prop.kind !== 'function')
        .map(prop => renderDefinition(prop, module, `${level}#`))
        .join('\n')}
    `;
};

const renderMethods = function(methods, module, level = '##') {
    if (!methods || !methods.length) {
        return '';
    }

    return `${level}# Methods

    ${methods
        .filter(method => method.kind === 'function')
        .map(method => renderDefinition(method, module, `${level}#`))
        .join('\n\n')}
    `;
};

const renderFunctionSignature = function(definition, module) {
    if (definition.kind !== 'function') {
        return '';
    }

    return `(${
        definition.params
            .map(param => param.name)
            .join(', ')
    }) => {${
        definition.return ?
            resolveType(definition.return.type, module, mdResolveFileName) : '?'
    }}`;
};

const renderDeprecated = function(content, definition) {
    if (definition.deprecated) {
        return `~~${content}~~`;
    }

    return content;
};

module.exports = function(modules, options) {
    return modules.map(module => ({ name: mdResolveFileName(module.name), content: renderModule(module, options)}));
};

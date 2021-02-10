const TypeProto = {
    location: null,

    toString() {
        return this.location ? `[${this.name}](${this.location})` : this.name;
    }
};

const defaultTypes = {
    'string': 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String',
    'number': 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number',
    'boolean': 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean',
    'function': 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/prototype',
    'Function': 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/prototype',
    'Array': 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array',
    'Promise': 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise',
    'Node': 'https://developer.mozilla.org/en-US/docs/Web/API/Node',
    'Element': 'https://developer.mozilla.org/en-US/docs/Web/API/Element',
    'HTMLElement': 'https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement',
    'void': 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/undefined',
    'undefined': 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/undefined',
    'null': 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/null',
    'object': 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object',
    'IDBDatabase': 'https://developer.mozilla.org/en-US/docs/Web/API/IDBDatabase',
    'IDBTransaction': 'https://developer.mozilla.org/en-US/docs/Web/API/IDBTransaction',

};


const resolveType = module.exports = function(type, module, fileNameResolver = null, exported = false) {
    if (typeof type !== 'string') {
        if (type === undefined) {
            return '?';
        }

        return resolveType(type.toString());
    }

    type = type.split('|');

    if (type.length > 1){
        return type.map(type => resolveType(type, module, fileNameResolver))
            .join('&#124;');
    }

    type = type[0];

    let generic = null;

    if ((generic = type.match(/([^<>.]+)\.<(.*)>$/))) {
        const [, type, returnType] = generic;

        return `${resolveType(type, module, fileNameResolver)}.&lt;${resolveType(returnType, module, fileNameResolver)}&gt;`;
    }

    if (/\[\]$/.test(type)) {
        return resolveType(`Array.<${type.substr(0, type.length - 2)}>`, module, fileNameResolver);
    }

    // we've got a type literal
    if (/^\s*\{.*\}\s*$/.test(type)) {
        let pair = null;
        const keyValueMatcher = /\s*([^\s:]+)\s*:\s*([^:\s]+)(?:\s*,|\s*,\s*}|\s*})/g;
        const resolvedLiteral = [];

        while ((pair = keyValueMatcher.exec(type))) {
            const [, key, value] = pair;

            resolvedLiteral.push(`${key}: ${resolveType(value, module, fileNameResolver)}`);
        }

        return `{ ${resolvedLiteral.join(', ')} }`;
    }

    if (!module) {
        return {
            name: type,
            __proto__: TypeProto,
        };
    }

    if (defaultTypes[type]) {
        return {
            name: type,
            location: defaultTypes[type],
            __proto__: TypeProto,
        };
    }

    const definition = Array.from(module.definitions).find(def => (exported ? def.export : def.name) === type);

    if (!definition) {
        return {
            name: type,
            __proto__: TypeProto,
        };
    }

    if (definition.kind !== 'import') {
        const filename = fileNameResolver ? fileNameResolver(module.name) : module.name;

        return {
            name: definition.name,
            location: `./${filename}#${definition.name.toLowerCase()}`,
            export: definition.export,
            __proto__: TypeProto,
        };
    }

    const originalType = definition.type;
    const originalDef = resolveType(originalType, module.parent.getModule(definition.origin), fileNameResolver, true);

    if (originalDef.name === 'default') {
        originalDef.name = definition.name;
    }

    if (originalDef && originalDef.location === null) {
        return originalDef.name.replace(/(\\\*|\*)/, '\\*');
    }

    if (originalDef && originalDef.export === originalType) {
        return originalDef;
    }

    if (originalDef && originalDef.export && originalDef.name === originalType) {
        return originalDef;
    }
};

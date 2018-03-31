const Definition = {
    name: '',
    type: null,
    params: null,
    description: '',
    kind: null,
    export: false,
    private: false,
    used: false,

    origin: null,

    /** @type {Module} */
    module: null,

    constructor() {
        this.params = [];

        return this;
    },
    
    toString() {
        if (this.kind === 'object') {
            return `{ ${this.params.map(param => `${param.name}: ${param.type}`).join(', ')} }`;
        }

        if (this.kind === 'function') {
            return `(${this.params.map(param => `${param.name}: ${param.type}`).join(', ')}) => ${this.return.type}`;
        }

        return super.toString();
    }
};

module.exports = Definition;

const Module = {

    /** @type {string} */
    name: null,

    /** @type {Set.<Definition>} */
    definitions: null,

    /** @type {Definition} */
    lastCommentDefinition: null,

    constructor() {
        this.definitions = new Set();

        return this;
    }
};

module.exports = Module;

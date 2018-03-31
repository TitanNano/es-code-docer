export const Document = {
    /**
     * @type {string}
     */
    url: null,

    /**
     * create a new Document
     *
     * @private
     *
     * @return {Document}
     */
    create() {},

    /**
     * Navigates to a new url
     *
     * @param  {string} url
     * @param  {boolean} replace determines if the current document should be replaced
     *
     * @return {State}
     */
    navigate(url, replace) {},

    /**
     * @private
     * @type {number}
     */
    property: null,

    /**
     * @private
     * @deprecated
     * @type {Node}
     */
    currentNode: null,

    /**
     * [list description]
     *
     * @deprecated don't use this anymore
     */
    list: [],
};

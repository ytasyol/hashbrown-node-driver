'use strict';

let fs = require('fs');
let path = require('path');

let cache;

/**
 * A helper class for fetching content
 */
class ContentHelper {
    /**
     * Gets the entire content tree
     *
     * @param {Boolean} updateCache
     *
     * @returns {Promise} Object
     */
    static getTree(updateCache = false) {
        HashBrown.ensureLocations();
            
        let jsonPath = HashBrown.getPath('storage/json');

        if(updateCache || !cache) {
            return new Promise((resolve, reject) => {
                fs.readFile(path.join(jsonPath, 'tree.json'), 'utf8', (err, data) => {
                    if(err) {
                        reject(new Error(err));
                    
                    } else {
                        var tree = JSON.parse(data);

						cache = tree;

                        resolve(tree);
                    }
                });
            });
            
        } else {
            return Promise.resolve(cache);

        }
    }
   
    /** 
     * Saves the JSON tree
     *
     * @param {Object} json
     *
     * @returns {Promise} promise
     */
    static setTree(json) {
        HashBrown.ensureLocations();

        let jsonPath = HashBrown.getPath(path.join('storage', 'json'));
 
        return new Promise((resolve, reject) => {
            if(typeof json === 'object') {
                try {
                    json = JSON.stringify(json, null, 4);
                } catch(e) {
                    return reject(new Error('[HashBrown] JSON data was invalid format when writing to tree'));
                }
            }

            if(!json) {
                return reject(new Error('[HashBrown] JSON data was null when writing to tree'));
            }

            console.log('[HashBrown] Writing content tree to ' + jsonPath + '...');
            
            fs.writeFile(path.join(jsonPath, 'tree.json'), json, 'utf8', (err, data) => {
                if(err) {
                    console.log('[HashBrown] Failed writing content tree: ' + err);
                    return reject(new Error(err));
				}
			
				cache = JSON.parse(json);

				console.log('[HashBrown] Successfully wrote content tree');
				resolve();
            });
        });
    }

    /**
     * Gets a content node by id
     *
     * @param {String} id
     *
     * @returns {Promise} Content
     */
    static getById(id) {
        return this.getTree()
        .then((tree) => {
            let node = tree[id];

            node.id = id;

            return Promise.resolve(node);
        });
    }	
    
    /**
     * Gets a content node by url
     *
     * @param {String} url
     *
     * @returns {Promise} Content
     */
    static getByUrl(url) {
        if(url[0] !== '/') {
            url = '/' + url;
        }

        if(url[url.length - 1] !== '/') {
            url = url + '/';
        }

        return this.getTree()
        .then((tree) => {
            for(let id in tree || {}) {
                let node = tree[id];
               
                if(node.url == url) {
                    return Promise.resolve(node);
                }

                for(let language in node.properties || {}) {
                    if(node.properties[language].url == url) {
                        let properties = node.properties[language];

                        properties.id = id;

                        return Promise.resolve(properties);
                    }
                }
            }

            return Promise.reject(new Error('Node by url "' + url + '" not found'));
        });
    }	
    
    /** 
     * Delete a content node by id
     *
     * @param {String} id
     *
     * @returns {Promise} Result
     */
    static deleteById(id) {
        return this.getTree(true)
        .then((tree) => {
            if(!tree[id]) {
                return Promise.resolve();
            }

            delete tree[id];

            return this.setTree(tree);
        });
    }
    
    /** 
     * Sets a content node by id
     *
     * @param {String} id
     * @param {Object} content
     *
     * @returns {Promise} Content
     */
    static setById(id, content) {
        if(!content || Object.keys(content).length < 1) {
            return Promise.reject(new Error('Provided Content node "' + id + '" was empty'));
        }

        return this.getTree(true)
        .then((tree) => {
            tree[id] = content;

            return this.setTree(tree);
        })
        .then(() => {
            return Promise.resolve(content);
        });
    }

    /** 
     * Sets content node properties by id
     *
     * @param {String} id
     * @param {Object} properties
     * @param {String} language
     * @param {Object} meta
     *
     * @returns {Promise} Content
     */
    static setPropertiesById(id, properties, language, meta) {
        return this.getTree(true)
        .then((tree) => {
            if(!tree[id]) {
                tree[id] = {};
            }

            if(!tree[id].properties) {
                tree[id].properties = {};
            }

            tree[id].properties[language] = properties;

            if(meta) {
                for(let k in meta) {
                    tree[id][k] = meta[k];
                }
            }

            return this.setTree(tree);
        })
        .then(() => {
            return Promise.resolve();
        });
    }
    
    /**
     * Gets content node properties by id
     *
     * @param {String} id
     * @param {String} language
     *
     * @returns {Promise} Content
     */
    static getPropertiesById(id, language) {
        return this.getTree()
        .then((tree) => {
            let content = tree[id];
            let properties = {};

            if(content) {
                properties = content.properties[language || 'en'] || {};
            }

            properties.id = id;

            return Promise.resolve(properties);
        });
    }	
}

module.exports = ContentHelper;

let HashBrown = require('./HashBrown');
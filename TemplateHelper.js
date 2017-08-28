'use strict';

let fs = require('fs');
let path = require('path');

/**
 * A helper class for fetching content
 */
class TemplateHelper {
    /** 
     * Gets a Template by name
     *
     * @param {String} type
     * @param {String} name
     *
     * @returns {Promise} Template
     */
    static get(type, name) {
        let relPath = HashBrown.getConfig().paths[type + 'Templates'];

        if(!relPath) {
            return Promise.reject(new Error('No path configured for "' + type + '" templates'));
        }

        let absPath = HashBrown.getRootPath(relPath);

        return new Promise((resolve, reject) => {
            fs.readFile(absPath + '/' + name, 'utf8', (err, file) => {
                if(err) {
                    return reject(new Error('Template by name "' + name + '" not found'));
                }

                resolve({
                    name: name,
                    id: name,
                    type: type,
                    markup: file
                });
            });
        });
    }
    
    /** 
     * Gets a Template by id
     *
     * @param {String} type
     * @param {String} id
     *
     * @returns {Promise} Template
     */
    static getById(type, id) {
        let relPath = HashBrown.getConfig().paths[type + 'Templates'];

        if(!relPath) {
            return Promise.reject(new Error('No path configured for "' + type + '" templates'));
        }

        let absPath = HashBrown.getRootPath(relPath);

        return new Promise((resolve, reject) => {
            fs.readdir(absPath, (err, files) => {
                if(err) {
                    return reject(new Error('Template by id "' + id + '" not found'));
                }

                for(let file of files) {
                    let name = path.basename(file);
                    let ext = path.extname(file);
                    let thisId = name.replace(ext, '');

                    if(thisId !== id) { continue; }

                    return fs.readFile(path.join(absPath, file), 'utf8', (err, content) => {
                        if(err) {
                            return reject(new Error('Template by id "' + id + '" not found'));
                        }

                        resolve({
                            name: name,
                            id: id,
                            type: type,
                            markup: content
                        });
                    });
                }

                return reject(new Error('Template by id "' + id + '" not found'));
            });
        });
    }

    /**
     * Gets all template objects
     *
     * @param {String} type
     *
     * @returns {Promise} Template
     */
    static getAll(type) {
        let relPath = HashBrown.getConfig().paths[type + 'Templates'];

        if(!relPath) {
            return Promise.reject(new Error('No path configured for "' + type + '" templates'));
        }

        let absPath = HashBrown.getRootPath(relPath);
       
        return new Promise((resolve, reject) => {
            fs.readdir(absPath, 'utf8', (err, files) => {
                if(err) {
                    reject(err);
                    return;
                }
                
                let allTemplates = []

                for(let file of files || []) {
                    if(file[0] == '.') { continue; }

                    allTemplates.push({
                        name: path.basename(file),
                        id: path.basename(file),
                        type: type
                    });
                }

                resolve(allTemplates);
            });
        });
    }	
}

module.exports = TemplateHelper;

let HashBrown = require('./HashBrown');

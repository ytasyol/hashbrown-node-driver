'use strict';

const fs = require('fs');
const path = require('path');

const CACHE_TIMEOUT = 1000;

let cache = {};

/**
 * A helper class for fetching content
 */
class MediaHelper {
    /**
     * Gets all media objects
     *
     * @returns {Promise} Media
     */
    static getAll() {
        let mediaPath = HashBrown.getPath('storage/media');
        let allMedia = []
        
        let readFolders = () => {
            return new Promise((resolve, reject) => {
                fs.readdir(mediaPath, 'utf8', (err, folders) => {
                    if(err) {
                        reject(err);
                        return;
                    }

                    if(folders.length < 1) {
                        resolve([]);
                        return;
                    }

                    resolve(folders);
                });
            });
        };
            
        let readFiles = (folders) => {
            let readNext = () => {
                let next = folders.pop();

                if(!next) {
                    return Promise.resolve();
                }

                return new Promise((resolve, reject) => {
                    fs.readdir(path.join(mediaPath, next), 'utf8', (err, files) => {
                        if(err) {
                            reject(err);
                            return;
                        }

                        if(files.length < 1) {
                            resolve();
                            return;
                        }

                        allMedia.push({
                            name: path.basename(files[0]),
                            id: next
                        });

                        resolve();
                    });
                })
                .then(readNext);
            };

            return readNext();
        };

        return readFolders()
        .then((folders) => {
            return readFiles(folders);
        })
        .then(() => {
            return Promise.resolve(allMedia);
        });
    }	
    
    /**
     * Gets a media object by id
     *
     * @param {String} id
     *
     * @returns {Promise} Media
     */
    static getById(id) {
        return new Promise((resolve, reject) => {
            let filePath = path.join(HashBrown.getPath('storage/media'), id);
        
            fs.readdir(filePath, 'utf8', (err, files) => {
                if(err) {
                    return reject(err);
                    return;
                }

                if(files.length < 1) {
                    return reject(new Error('Media folder "' + id + '" is empty'));
                }

                resolve(files[0]);
            });
        });
    }	
    
    /**
     * Gets a media object by id (cached)
     *
     * @param {String} id
     *
     * @returns {Media} The Media object
     */
    static getCachedById(id) {
        // If the id was null, we just fail silently
        if(!id) { return null; }

        // Check cache
        if(cache[id]) {
            if(Date.now() - cache[id].time > CACHE_TIMEOUT) {
                delete cache[id];
            } else {
                return cache[id];
            }
        }

        // If cache was expired, fetch new content
        let filePath = path.join(HashBrown.getPath('storage/media'), id);
        let files = fs.readdirSync(filePath, 'utf8') || [];

        if(files.length < 1) {
            throw new Error('Media by id "' + id + '" could not be found');
        }

        // Add new Media to cache
        let media = {
            id: id,
            filename: path.basename(files[0]),
            extension: path.extname(files[0])
        };

        media.name = media.filename.replace(media.extension, '');
        media.url = '/media/' + id + '/' + media.filename;

        cache[id] = media;
    
        return cache[id];
    }	
    
    /**
     * Sets a Media object by id
     *
     * @param {String} id
     * @param {String} filename
     * @param {String} base64
     *
     * @returns {Promise} Result
     */
    static setById(id, filename, base64) {
        console.log('[HashBrown] Setting media "' + id + '"...');

        let buffer = Buffer.from(base64, 'base64');

        return new Promise((resolve, reject) => {
            let folderPath = path.join(HashBrown.getPath('storage/media'), id);

            if(!fs.existsSync(folderPath)) {
                HashBrown.mkdirRecursively(folderPath);
            } 

            fs.writeFile(folderPath + '/' + filename, buffer, (err) => {
                if(err) {
                    reject(err);
                    return;  
                }

                delete cache[id];

                resolve('OK');
            });
        });
    }
    
    /**
     * Deletes a Media object by id
     *
     * @param {String} id
     *
     * @returns {Promise} Result
     */
    static deleteById(id) {
        let folderPath = path.join(HashBrown.getPath('storage/media'), id);

        console.log('[HashBrown] Deleting media "' + id + '"...');

        return new Promise((resolve, reject) => {
            if(!fs.existsSync(folderPath)) {
                console.log('[HashBrown] Media "' + id + '" was not found');
                reject(new Error('Media "' + id + '" was not found'));
            } 

            HashBrown.rmdirRecursively(folderPath);

            console.log('[HashBrown] Media "' + id + '" deleted successfully');
            resolve('Media "' + id + '" deleted successfully');
        });
    }
}

module.exports = MediaHelper;

let HashBrown = require('./HashBrown');

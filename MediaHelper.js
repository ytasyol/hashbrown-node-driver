'use strict';

let fs = require('fs');
let path = require('path');

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
                    fs.readdir(mediaPath + '/' + next, 'utf8', (err, files) => {
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
            let path = HashBrown.getPath('storage/media');
        
            fs.readdir(path + '/' + id, 'utf8', (err, files) => {
                if(err) {
                    reject(err);
                    return;
                }

                if(files.length < 1) {
                    reject(new Error('Media folder "' + id + '" is empty'));
                    return;
                }

                resolve(files[0]);
            });
        });
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
            let folderPath = HashBrown.getPath('storage/media') + '/' + id;

            if(!fs.existsSync(folderPath)) {
                HashBrown.mkdirRecursively(folderPath);
            } 

            fs.writeFile(folderPath + '/' + filename, buffer, (err) => {
                if(err) {
                    reject(err);
                    return;  
                }

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
        let folderPath = HashBrown.getPath('storage/media') + '/' + id;

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

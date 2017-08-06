'use strict';

let HTTP = require('http');
let HTTPS = require('https');
let QueryString = require('querystring');
let URL = require('url');

/**
 * A helpers class for processing forms
 */
class FormsHelper {
    /**
     * Submits an entry
     *
     * @param {String} id
     * @param {Object} query
     *
     * @returns {Promise} Result
     */
    static postEntry(id, query) {
        var remote = HashBrown.getConfig().remote;

        if(!remote) {
            return Promise.reject(new Error('No remote was set in config'));
        }

        remote = URL.parse(remote);

        let project = HashBrown.getConfig().project;
        
        if(!project) {
            return Promise.reject(new Error('No project was set in config'));
        }
        
        let environment = HashBrown.getConfig().environment;
        
        if(!environment) {
            return Promise.reject(new Error('No environment was set in config'));
        }

        let token = HashBrown.getConfig().token;
        
        if(!token) {
            return Promise.reject(new Error('No token was set in config'));
        }

        query = QueryString.stringify(query);

        return new Promise((resolve, reject) => {
            let request = (remote.protocol === 'https:' ? HTTPS : HTTP).request({
                port: remote.port,
                host: remote.hostname,
                path: '/api/' + project + '/' + environment + '/forms/' + id + '/submit',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Content-Length': Buffer.byteLength(query),
                    'Origin': 'hashbrown-driver/' + token,
                    'User-Agent': 'HashBrown Driver'
                }
            }, (response) => {
                response.setEncoding('utf8');
                response.on('data', (chunk) => {
                    if(chunk == 'OK') {
                        resolve(chunk);
                    } else {
                        reject(new Error(chunk));
                    }
                });
            });
            
            request.on('error', (err) => {
                reject(err);
            });

            request.write(query);
            request.end();
        });
    }
}

module.exports = FormsHelper;

let HashBrown = require('./HashBrown');

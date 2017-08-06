'use strict';

class HashBrownClient {
    /**
     * Generic request
     *
     * @param {String} method
     * @param {String} url
     * @param {Object} data
     *
     * @returns {Promise} Result
     */
    static request(method, url, data) {
        return new Promise((resolve, reject) => {
            var request = new XMLHttpRequest();
            request.open(method, url, true);

            request.setRequestHeader('Accepts', 'application/json');
            request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')

            request.onload = function() {
                if (request.status >= 200 && request.status < 400) {
                    var data = request.responseText;
                    
                    try {
                        data = JSON.parse(request.responseText);
                    } catch(e) {
                        // Sometimes the response isn't JSON, and that's cool too.
                    }

                    resolve(data);
                } else {
                    reject(new Error(request.responseText));

                }
            };

            request.onerror = function(e) {
                reject(e);
            };

            if(typeof data === 'object') {
                var query = '';

                for(var k in data) {
                    query += k + '=' + data[k] + '&';
                }

                query = query.substring(0, query.length - 1);

                data = query;
            }

            request.send(data);
        });
    }
    
    /**
     * Gets a content node by url
     *
     * @param {String} url
     *
     * @returns {Promise} Content
     */
    static getContentByUrl(url) {
        return this.request('get', '/hashbrown/content' + url);
    }
    
    /**
     * Gets a content node by id
     *
     * @param {String} id
     * @param {String} language
     *
     * @returns {Promise} Content
     */
    static getContentById(id, language = 'en') {
        return this.request('get', '/hashbrown/content/' + id)
        .then((content) => {
            if(!content || !content.properties) {
                return Promise.reject(new Error('Content by id "' + id + '" not found'));
            }

            if(!content.properties[language]) {
                return Promise.reject(new Error('Properties for language "' + language + '" for Content by id "' + id + '" not found'));
            }

            let properties = content.properties[language];

            properties.id = id;

            return Promise.resolve(properties);
        });
    }
}

window.HashBrown = HashBrownClient;

module.exports = HashBrownClient;

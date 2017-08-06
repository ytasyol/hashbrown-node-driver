'use strict';

class Controller {
    /**
     * Inits the driver
     *
     * @param {Object} app Express.js app object
     */
    static init(app) {
        // Content API
        app.get('/hashbrown/api/content/tree', this.authorize, this.getTree);
        app.get('/hashbrown/api/content/:id', this.authorize, this.getContentById);
        app.get('/hashbrown/api/content/:id/properties/', this.authorize, this.getContentPropertiesById);
        app.get('/hashbrown/api/content/:id/properties/:language', this.authorize, this.getContentPropertiesById);
        
        app.post('/hashbrown/api/content/:id', this.authorize, this.setContentById);
        app.post('/hashbrown/api/content/:id/properties', this.authorize, this.setContentPropertiesById);

        app.delete('/hashbrown/api/content/:id', this.authorize, this.deleteContentById);
        
        // Media API
        app.get('/hashbrown/api/media/:id', this.authorize, this.getMediaById);
        app.get('/hashbrown/api/media', this.authorize, this.getAllMedia);
        
        app.post('/hashbrown/api/media/:id', this.authorize, this.setMediaById);
     
        app.delete('/hashbrown/api/media/:id', this.authorize, this.deleteMediaById);
  
        // Template API
        app.get('/hashbrown/api/templates/:type/:id', this.authorize, this.getTemplateById);
        app.get('/hashbrown/api/templates/:type', this.authorize, this.getAllTemplates);

        // Forms post
        app.post('/hashbrown/forms/:id', this.authorize, this.postForm);
        
        // Serve media
        app.get('/media/:id', this.serveMedia);
    }

    /**
     * Authorise a call
     */
    static authorize(req, res, next) {
        let isLocal = 
            req.ip === '::ffff:127.0.0.1' ||
            req.ip === '::1' ||
            req.ip === '127.0.0.1';

        if(req.query && req.query.token == HashBrown.getConfig().token || isLocal) {
            next();
        } else {
            console.log('[HashBrown] Invalid token');
            res.status(402).send('Invalid token');
        }
    }

    /**
     * Posts a form entry
     */
    static postForm(req, res) {
        HashBrown.forms.postEntry(req.params.id, req.body)
        .then(() => {
            res.status(200).send('OK');
        })
        .catch((e) => {
            res.status(502).send(e.message);
        });
    }
    
    /**
     * Gets a content node by url
     */
    static serveContent(req, res) {
        let params = req.params[0] || '';

        let getContent = () => {
            // Content was requested by id
            if(params.match(/[a-z0-9]{40}/)) {
                return HashBrown.content.getById(params)

            // Content was requested by URL
            } else {
                return HashBrown.content.getByUrl('/' + params)
            }
        };

        getContent()
        .then((content) => {
            res.status(200).send(content);
        })
        .catch((e) => {
            res.status(404).send(e.message);
        });
    }

    /**
     * Gets a content node by id
     */
    static getContentById(req, res) {
        HashBrown.content.getById(req.params.id)
        .then((content) => {
            res.status(200).send(content);
        })
        .catch((e) => {
            res.status(404).send(e.message);
        });
    }
    
    /**
     * Deletes a content node by id
     */
    static deleteContentById(req, res) {
        HashBrown.content.deleteById(req.params.id)
        .then(() => {
            res.status(200).send('OK');
        })
        .catch((e) => {
            res.status(502).send(e.message);
        });
    }
    
    /**
     * Sets a content node by id
     */
    static setContentById(req, res) {
        HashBrown.content.setById(req.params.id, req.params.body)
        .then((content) => {
            res.status(200).send(content);
        })
        .catch((e) => {
            res.status(502).send(e.message);
        });
    }
    
    /**
     * SGets content properties by id
     */
    static setContentPropertiesById(req, res) {
        HashBrown.content.setPropertiesById(req.params.id, req.body.properties, req.body.language, req.body.meta)
        .then((content) => {
            res.status(200).send(content);
        })
        .catch((e) => {
            res.status(502).send(e.message);
        });
    }

    /**
     * Gets content properties by id
     */
    static getContentPropertiesById(req, res) {
        HashBrown.content.getPropertiesById(req.params.id, req.params.language)
        .then((content) => {
            res.status(200).send(content);
        })
        .catch((e) => {
            res.status(502).send(e.message);
        });
    }

    /**
     * Gets the entire content tree
     */
    static getTree(req, res) {
        HashBrown.content.getTree()
        .then((tree) => {
            res.status(200).send(tree);
        })
        .catch((e) => {
            res.status(502).send(e.message);
        });
    }
    
    /**
     * Gets a Template by id
     */
    static getTemplateById(req, res) {
        HashBrown.templates.getById(req.params.type, req.params.id)
        .then((template) => {
            res.status(200).send(template);
        })
        .catch((e) => {
            res.status(404).send(e.message);
        });
    }
    
    /**
     * Gets all Templates
     */
    static getAllTemplates(req, res) {
        HashBrown.templates.getAll(req.params.type)
        .then((templates) => {
            res.status(200).send(templates);
        })
        .catch((e) => {
            res.status(404).send(e.message);
        });
    }
    
    /**
     * Gets all Media objects
     */
    static getAllMedia(req, res) {
        HashBrown.media.getAll()
        .then((media) => {
            res.status(200).send(media);
        })
        .catch((e) => {
            res.status(404).send(e.message);
        });
    }
    
    /**
     * Gets a media object by id
     */
    static getMediaById(req, res) {
        HashBrown.media.getById(req.params.id)
        .then((media) => {
            res.status(200).send(media);
        })
        .catch((e) => {
            res.status(404).send(e.message);
        });
    }
    
    /**
     * Serve a Media object by id
     */
    static serveMedia(req, res) {
        let media = HashBrown.media.getCachedById(req.params.id);

        if(!media) {
            return res.status(404).send('Not found');
        }

        res.status(200).sendFile(HashBrown.getPath('storage/media') + '/' + media.id + '/' + media.filename);
    }
    
    /**
     * Deletes a media object by id
     */
    static deleteMediaById(req, res) {
        HashBrown.media.deleteById(req.params.id)
        .then((media) => {
            res.status(200).send(media);
        })
        .catch((e) => {
            res.status(404).send(e.message);
        });
    }
    
    /**
     * Sets a media object by id
     */
    static setMediaById(req, res) {
        HashBrown.media.setById(req.params.id, req.body.filename, req.body.content)
        .then((media) => {
            res.status(200).send(media);
        })
        .catch((e) => {
            res.status(404).send(e.message);
        });
    }
}

module.exports = Controller;

let HashBrown = require('./HashBrown');

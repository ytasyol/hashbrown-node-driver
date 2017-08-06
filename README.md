## Prerequisites
For this example, we'll be using express and the [HashBrown node.js driver](https://github.com/Putaitu/hashbrown-cms-node-driver)
We need the `body-parser` package to allow pushing content changes, as they are consumed via a REST API.  
In this example, we're using `pug` for templating, but that's up to you.

Install the dependencies:

```bash
$ npm install
```

## Setting up HashBrown
- Create a new project in the dashboard  

### Connection
- In this new project, create a Connection of type "HashBrown Driver"
- Set the URL to `http://localhost:8000`
- Set the token to `3340e90b6135a7e2bec659061778ab7b1ddba9f0`
- You should see the templates pop up in the "Templates" pane

### Schemas
- Create a new child Schema under the "Struct" type called "Rich Text Section"
- Set this config
```
```

- Create a new Content Schema called "Section Page"

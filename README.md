# Node.js driver for HashBrown CMS
A tool for easily accessing your HashBrown CMS content data on your site

# Usage 
```
$ npm install hashbrown-driver
```
```javascript
const HashBrown = require('hashbrown-driver');
```

# Example project
Check out the [example project](https://github.com/Putaitu/hashbrown-node-driver/tree/example)

# API
The helper classes are accessed thusly:

```javascript
HashBrown.content       // ContentHelper
HashBrown.media         // MediaHelper
HashBrown.forms         // FormsHelper
HashBrown.templates     // TemplateHelper
```

<a name="ContentHelper"></a>

## ContentHelper
A helper class for fetching content

**Kind**: global class  

* [ContentHelper](#ContentHelper)
    * [.getTree(updateCache)](#ContentHelper.getTree) ⇒ <code>Promise</code>
    * [.setTree(json)](#ContentHelper.setTree) ⇒ <code>Promise</code>
    * [.getById(id)](#ContentHelper.getById) ⇒ <code>Promise</code>
    * [.getByUrl(url)](#ContentHelper.getByUrl) ⇒ <code>Promise</code>
    * [.deleteById(id)](#ContentHelper.deleteById) ⇒ <code>Promise</code>
    * [.setById(id, content)](#ContentHelper.setById) ⇒ <code>Promise</code>
    * [.setPropertiesById(id, properties, language, meta)](#ContentHelper.setPropertiesById) ⇒ <code>Promise</code>
    * [.getPropertiesById(id, language)](#ContentHelper.getPropertiesById) ⇒ <code>Promise</code>

<a name="ContentHelper.getTree"></a>

### ContentHelper.getTree(updateCache) ⇒ <code>Promise</code>
Gets the entire content tree

**Kind**: static method of [<code>ContentHelper</code>](#ContentHelper)  
**Returns**: <code>Promise</code> - Object  

| Param | Type | Default |
| --- | --- | --- |
| updateCache | <code>Boolean</code> | <code>false</code> | 

<a name="ContentHelper.setTree"></a>

### ContentHelper.setTree(json) ⇒ <code>Promise</code>
Saves the JSON tree

**Kind**: static method of [<code>ContentHelper</code>](#ContentHelper)  
**Returns**: <code>Promise</code> - promise  

| Param | Type |
| --- | --- |
| json | <code>Object</code> | 

<a name="ContentHelper.getById"></a>

### ContentHelper.getById(id) ⇒ <code>Promise</code>
Gets a content node by id

**Kind**: static method of [<code>ContentHelper</code>](#ContentHelper)  
**Returns**: <code>Promise</code> - Content  

| Param | Type |
| --- | --- |
| id | <code>String</code> | 

<a name="ContentHelper.getByUrl"></a>

### ContentHelper.getByUrl(url) ⇒ <code>Promise</code>
Gets a content node by url

**Kind**: static method of [<code>ContentHelper</code>](#ContentHelper)  
**Returns**: <code>Promise</code> - Content  

| Param | Type |
| --- | --- |
| url | <code>String</code> | 

<a name="ContentHelper.deleteById"></a>

### ContentHelper.deleteById(id) ⇒ <code>Promise</code>
Delete a content node by id

**Kind**: static method of [<code>ContentHelper</code>](#ContentHelper)  
**Returns**: <code>Promise</code> - Result  

| Param | Type |
| --- | --- |
| id | <code>String</code> | 

<a name="ContentHelper.setById"></a>

### ContentHelper.setById(id, content) ⇒ <code>Promise</code>
Sets a content node by id

**Kind**: static method of [<code>ContentHelper</code>](#ContentHelper)  
**Returns**: <code>Promise</code> - Content  

| Param | Type |
| --- | --- |
| id | <code>String</code> | 
| content | <code>Object</code> | 

<a name="ContentHelper.setPropertiesById"></a>

### ContentHelper.setPropertiesById(id, properties, language, meta) ⇒ <code>Promise</code>
Sets content node properties by id

**Kind**: static method of [<code>ContentHelper</code>](#ContentHelper)  
**Returns**: <code>Promise</code> - Content  

| Param | Type |
| --- | --- |
| id | <code>String</code> | 
| properties | <code>Object</code> | 
| language | <code>String</code> | 
| meta | <code>Object</code> | 

<a name="ContentHelper.getPropertiesById"></a>

### ContentHelper.getPropertiesById(id, language) ⇒ <code>Promise</code>
Gets content node properties by id

**Kind**: static method of [<code>ContentHelper</code>](#ContentHelper)  
**Returns**: <code>Promise</code> - Content  

| Param | Type |
| --- | --- |
| id | <code>String</code> | 
| language | <code>String</code> | 

<a name="FormsHelper"></a>

## FormsHelper
A helpers class for processing forms

**Kind**: global class  
<a name="FormsHelper.postEntry"></a>

### FormsHelper.postEntry(id, query) ⇒ <code>Promise</code>
Submits an entry

**Kind**: static method of [<code>FormsHelper</code>](#FormsHelper)  
**Returns**: <code>Promise</code> - Result  

| Param | Type |
| --- | --- |
| id | <code>String</code> | 
| query | <code>Object</code> | 



<a name="TemplateHelper"></a>

## TemplateHelper
A helper class for fetching templates

**Kind**: global class  

* [TemplateHelper](#TemplateHelper)
    * [.get(type, name)](#TemplateHelper.get) ⇒ <code>Promise</code>
    * [.getAll(type)](#TemplateHelper.getAll) ⇒ <code>Promise</code>

<a name="TemplateHelper.get"></a>

### TemplateHelper.get(type, name) ⇒ <code>Promise</code>
Gets a Template by name

**Kind**: static method of [<code>TemplateHelper</code>](#TemplateHelper)  
**Returns**: <code>Promise</code> - Template  

| Param | Type |
| --- | --- |
| type | <code>String</code> | 
| name | <code>String</code> | 

<a name="TemplateHelper.getAll"></a>

### TemplateHelper.getAll(type) ⇒ <code>Promise</code>
Gets all template objects

**Kind**: static method of [<code>TemplateHelper</code>](#TemplateHelper)  
**Returns**: <code>Promise</code> - Template  

| Param | Type |
| --- | --- |
| type | <code>String</code> | 


'use strict';
const db = require('@arangodb').db;

db._drop(module.context.collectionName('Movie'));
db._drop(module.context.collectionName('User'));
db._drop(module.context.collectionName('rates'));

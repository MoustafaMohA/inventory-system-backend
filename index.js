'use strict';
const config = require('./environment/inventory-system.development')
const express = require('express');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json({limit: 1024 * 1024 * 20, type: 'application/json'});

const app = express();
app.use(jsonParser);

process.env.NODE_ENV = process.env.NODE_ENV ? process.env.NODE_ENV : 'development';

// init the different routes.
require('./app/routes')(app);

// start the server.
app.listen(config.port, () => {
    console.log(`Server started on port ${config.port}`);
});

// expose app to be available across the application.
exports = module.exports = app;

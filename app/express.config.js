'use strict';
const bodyParser = require('body-parser');

module.exports = (app) => {
    const jsonParser = bodyParser.json({limit: 1024 * 1024 * 20, type: 'application/json'});
    app.use(jsonParser);
}

'use strict';
/**
 * routes.js is responsible for defining the different routes for backend.
 * @param app an instance from express app to register routes
 */
module.exports = (app) => {
    app.use('/api/product', require('./api/product'));
    app.use('/api/auth', require('./api/auth'));
}

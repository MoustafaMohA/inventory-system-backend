'use strict';

const mysqlUtility = require('../../utility/mysql.utility');
const config = require('../../../environment/inventory-system.development');
const jwt = require('jsonwebtoken');

exports.login = (req, res) => {
    const user = req.body;
    if (!user.username || !user.password) {
        res.status(400).send('Invalid user data');
    }
    const searchQuery = `SELECT * FROM ${config.database}.users where username = '${user.username}' AND password = '${user.password}'`;
    mysqlUtility.execute(searchQuery)
        .then(value => {
            if (value.length === 0) {
                res.status(401).send();
            }

            const userData = value[0];
            jwt.sign({id: userData.id}, config.secret, {expiresIn: 7200}, function (err, token) {
                res.send({
                    token: token
                })
            });
        })
};

exports.logout = (req, res) => {
    res.status(200).send();
}

exports.verifyToken = (req, res, next) => {
    let token = req.headers['authorization'];
    if (!token) {
        return res.status(401).send({
            message: 'Invalid token value'
        });
    }
    token = token.replace('Bearer ', '');
    jwt.verify(token, config.secret, (err, decode) => {
        if (err) {
            return res.status(401).send({
                message: 'Unauthorized!'
            });
        }
        // populate user id in case we want to filter only user resources.
        req.userId = decode.id;

        next();
    })
};

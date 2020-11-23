'use strict';

const mysqlUtility = require('../../utility/mysql.utility');
const config = require('../../../environment/inventory-system.development');

exports.list = (req, res) => {
    mysqlUtility.execute(`SELECT * FROM ${config.database}.products`).then((data) => {
        res.send(data);
    }).catch(reason => {
        res.status(500).send(reason);
    });
};

exports.create = (req, res) => {
    const product = req.body;
    const callback = (err, data) => {
        if (err)
            return res.status(500).send(err);

        return res.send(data);
    }
    mysqlUtility.insert('products', product, callback);
};

exports.delete = (req, res) => {
    const productId = req.params.id;
    if (!productId) {
        res.send(400).send("Product ID can't be null");
    }
    executeDelete([productId], res);
};

exports.deleteAll = (req, res) => {
    const productsIds = req.body.products;
    if (!productsIds) {
        res.send(400).send("Product ID  List can't be null");
    }
    executeDelete(productsIds, res);
};

exports.get = (req, res) => {
    const id = req.params.id;
    if (!id) {
        res.send(400).send("Product ID can't be null");
    }
    const selectQuery = `SELECT * FROM ${config.database}.products WHERE id = ${id}`;
    mysqlUtility.execute(selectQuery).then(value => {
        res.send(value);
    }).catch(reason => {
        res.status(500).body(reason);
    });
};

const executeDelete = (productsList, res) => {
    const productsID = productsList.join();
    const deleteQuery = `DELETE FROM ${config.database}.products WHERE id in (${productsID})`;
    mysqlUtility.execute(deleteQuery)
        .then(value => res.send(value))
        .catch(reason => res.status(500).send(reason));
}

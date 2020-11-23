'use strict';

const mysql = require('mysql');
const config = require('../../environment/inventory-system.development');
const connection = mysql.createConnection(config.mysql);

connection.connect((err) => {
    if (err) {
        console.error(`Failed to connect to SQL server ${config.mysql.host},  ${err}`);
        process.exit(1);
    }

    if (process.env.NODE_ENV === 'development') {
        createDB().then(() => {
            createTables();
        }).catch(err => console.log(`Error during database creation ${err}`));
    }
    // console.log(`Connection opened to DB server ${config.mysql.host}, ${connection.threadId}`);
});

const createDB = () => {
    const createDBIfNotExist = `CREATE DATABASE IF NOT EXISTS ${config.database};`;
    return createQuery(createDBIfNotExist);
};

const createTables = () => {
    // TODO replace with script file .sql and create a utility reader to read and execute queries.
    const createUserTableQuery = `CREATE TABLE IF NOT EXISTS inventory_system.users (
            id INT NOT NULL AUTO_INCREMENT,
            username VARCHAR(45) NOT NULL,
            email VARCHAR(45) NOT NULL,
            password VARCHAR(45) NOT NULL,
            PRIMARY KEY (id))`;

    const createProductTableQuery = `CREATE TABLE  IF NOT EXISTS inventory_system.products (
            id INT NOT NULL AUTO_INCREMENT,
            productName VARCHAR(45) NULL,
            productDescription VARCHAR(45) NULL,
            createdUser INT NOT NULL,
            price DECIMAL(10,2) NULL,
            PRIMARY KEY (id));`;

    Promise.all([createQuery(createUserTableQuery), createQuery(createProductTableQuery)])
        .then(value => {
            // console.log(`Tables has been created`);
            if (config.seedDB) {
                require('../../init/seed')();
            }
        }).catch(reason => console.log(`Error while creating tables ${reason}`));
};

const createQuery = (queryString) => {
    return new Promise((resolve, reject) => {
        connection.query(queryString, (error, data, fields) => {
            if (error) {
                reject(error);
            }

            resolve(data);
        })
    });
}

const insert = (tableName, object, callback) => {
    const checkTableExistsQuery = `SELECT count(*) as count FROM information_schema.TABLES WHERE (TABLE_SCHEMA = '${config.database}') AND (TABLE_NAME = '${tableName}')`;

    createQuery(checkTableExistsQuery).then((data) => {
        const count = data[0].count;
        if (count === 1) {
            const columns = Object.keys(object).join();
            const values = Object.values(object).join();
            const insertStatement = `INSERT INTO ${config.database}.${tableName} (${columns}) VALUES (${values})`;
            createQuery(insertStatement).then(value => {
                // console.log(`new object has been created in ${tableName}`);
                if (callback) {
                    callback(null, data);
                }
            }).catch(reason => {
                if (callback) {
                    callback(reason, null);
                }
            });
        } else {
            callback(new Error(`No table with name ${tableName}`), null);
        }
    }).catch(reason => {
        if(callback) {
            callback(reason, null);
        }
    })
};

// TODO doesn't return the connection direct to protect altering of DB.
exports.insert = insert;
exports.execute = createQuery;

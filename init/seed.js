const mysqlUtility = require('../app/utility/mysql.utility');
// a seed file to initialize database with some data.

// TODO handle if we already run the seed before and the data is already inserted.
module.exports = () => {
    // console.log('Seed DB')

    const user = {
        username: '"system"',
        password: '"system"',
        email: '"system@inventory.com"'
    };
    mysqlUtility.insert('users', user);

    const product = {
        productName: '"Apple Iphone XS MAX - 64GB"',
        productDescription: '"The new telephone from Apple"',
        createdUser: 1
    };
    mysqlUtility.insert('products', product);
}

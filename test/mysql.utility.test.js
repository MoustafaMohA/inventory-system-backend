const chai = require('chai');

const mysqlUtility = require('../app/utility/mysql.utility');
const config = require('../environment/inventory-system.development');

describe('Mysql Utility', () => {

    it('should test the insert method - success', (done) => {
        mysqlUtility.insert('users', {
            username: '"TEST_001"',
            email: '"email@test.com"',
            password: '"2222"'
        }, (err, data) => {
            chai.expect(data.length).to.be.equal(1);
            done();
        })
    });

    it('should test insertion in wrong table', (done) => {
        mysqlUtility.insert('wrongTableName', {
            username: '"TEST_001"',
            email: '"email@test.com"',
            password: '"2222"'
        }, (err, data) => {
            chai.expect(err.message).to.be.equal(`No table with name wrongTableName`);
            chai.expect(data).to.be.equal(null);
            done();
        })
    });

    it('should test insertion in wrong data', (done) => {
        mysqlUtility.insert('users', {
            username: 'Wrong user name',
            email: '"email@test.com"',
            password: '"2222"'
        }, (err, data) => {
            chai.expect(err).to.throw;
            done();
        })
    });

    it('should test the execute method', (done) => {
        const queryString = `SELECT * FROM ${config.database}.users`;
        mysqlUtility.execute(queryString).then(data => {
            chai.expect(data.length).to.be.gte(0);
           done();
        });
    });
})

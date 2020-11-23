const chaiHttp = require('chai-http');
const jwt = require('jsonwebtoken');
const chai = require('chai');

const config = require('../environment/inventory-system.development.js');
const app = require('../index');
chai.use(chaiHttp);

var TOKEN = '';

describe('Product Controller Test', () => {

    // Generate a token with system user to run all tests.
    before((done) => {
        jwt.sign({id: 1}, config.secret, {expiresIn: 7200}, (err, token) => {
            TOKEN = token;
            done();
        });
    })

    it('Should list all the products available', function (done) {
        chai.request(app)
            .get('/api/product/')
            .set('authorization', TOKEN)
            .end((err, res) => {
                chai.expect(res.status).to.be.equal(200);
                done();
            });
    });

    it('Should try to create a product with empty request body', function (done) {
        chai.request(app)
            .post('/api/product/')
            .set('authorization', TOKEN)
            .end((err, res) => {
                chai.expect(res.status).to.be.equal(500);
                done();
            });
    });

    it('Should try to create a product with correct request body', function (done) {
        chai.request(app)
            .post('/api/product/')
            .send({
                productName: '"NAME"',
                productDescription: '"productDescription"',
                createdUser: 1,
                price: 1700
            })
            .set('authorization', TOKEN)
            .end((err, res) => {
                chai.expect(res.status).to.be.equal(200);
                done();
            });
    });

    it('Should try to create a product wrong column name', function (done) {
        chai.request(app)
            .post('/api/product/')
            .send({
                wrongColumnName: '"NAME"',
                productDescription: '"productDescription"',
                createdUser: 1,
                price: 1700
            })
            .set('authorization', TOKEN)
            .end((err, res) => {
                chai.expect(res.status).to.be.equal(500);
                done();
            });
    });

    it('Should try to delete the product but not send the product id', function (done) {
        chai.request(app)
            .delete('/api/product/')
            .set('authorization', TOKEN)
            .end((err, res) => {
                chai.expect(res.status).to.be.equal(404);
                done();
            });
    });

    it('Should try to delete the product having id', function (done) {
        chai.request(app)
            .delete('/api/product/1')
            .set('authorization', TOKEN)
            .end((err, res) => {
                chai.expect(res.status).to.be.equal(200);
                done();
            });
    });

    it('Should try to delete by sending list of id', function (done) {
        chai.request(app)
            .post('/api/product/delete-all')
            .send({
                products: [1, 2, 3, 4]
            })
            .set('authorization', TOKEN)
            .end((err, res) => {
                chai.expect(res.status).to.be.equal(200);
                done();
            });
    });

    it('Should try to get a product given id ', function (done) {
        chai.request(app)
            .get('/api/product/1')
            .set('authorization', TOKEN)
            .end((err, res) => {
                chai.expect(res.status).to.be.equal(200);
                done();
            });
    });
});

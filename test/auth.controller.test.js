const chaiHttp = require('chai-http');
const jwt = require('jsonwebtoken');
const chai = require('chai');

const config = require('../environment/inventory-system.development.js');
const app = require('../index');

chai.use(chaiHttp);

describe('Auth Controller', () => {
    it('Should do login without username and password', (done) => {
        chai.request(app)
            .post('/api/auth/login')
            .send()
            .end((err, res) => {
                chai.expect(res).to.have.status(400);
                done();
            });
    });

    it('Should do login with username and password', (done) => {
        chai.request(app)
            .post('/api/auth/login')
            .send({
                username: 'system',
                password: 'system'
            })
            .end((err, res) => {
                chai.expect(res).to.have.status(200);
                chai.expect(res.body.token.length).to.be.gt(0);
                done();
            });
    });

    it('Should do login with wrong username and password', (done) => {
        chai.request(app)
            .post('/api/auth/login')
            .send({
                username: 'system11',
                password: 'syste11m'
            })
            .end((err, res) => {
                chai.expect(res).to.have.status(401);
                done();
            });
    });

    it('Should test the token verification in case error', (done) => {
        chai.request(app)
            .get('/api/auth/logout')
            .end((err, res) => {
                chai.expect(res).to.have.status(403);
                done();
            });
    });

    it('Should test the token verification in case 403', (done) => {
        chai.request(app)
            .get('/api/auth/logout')
            .end((err, res) => {
                chai.expect(res).to.have.status(403);
                done();
            });
    });

    it('Should test the token verification in case correct token added', (done) => {
        jwt.sign({id: 1}, config.secret, {expiresIn: 7200}, (error, token) => {
            chai.request(app)
                .get('/api/auth/logout')
                .set('Authorization', `Bearer ${token}`)
                .end((err, res) => {
                    chai.expect(res).to.have.status(200);
                    done();
                });
        });
    });
});

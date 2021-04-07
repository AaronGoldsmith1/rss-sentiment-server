const supertest = require('supertest');
const { describe } = require('mocha')
const { expect } = require('chai')

const app = require('../server');
const db = require('../models');

describe('GET /api/v1/feeds', function() { 
  it('it should have status code 200', function(done) { 
     supertest(app)
      .get('/api/v1/feeds')
      .expect(200)
      .end(function(err, res){
        if (err) done(err);
        done();
      });
  })
})

describe('POST /api/v1/feeds', function() {
  it('it should have return status code 400 if there is no feed URL', function(done) {
    supertest(app)
      .post('/api/v1/feeds')
      .send({userId: 1234})
      .expect(400)
      .end(function(err, res){
        if (err) done(err);
        done();
    });
  })
})

describe('POST /api/v1/feeds', function() {
  it('it should have return status code 401 if there is no user id', function(done) {
    supertest(app)
      .post('/api/v1/feeds')
      .send({feedUrl: 'www.sampleRSS.com'})
      .expect(401)
      .end(function(err, res){
        if (err) done(err);
        done();
    });
  })
})

describe('POST /api/v1/feeds', function() {
  it('it should create a new feed and store it for a user', async function() {
    const user = await db.User.create({
      username: 'user9',
      email: 'user9@fake.com',
      password: 'password'
    })

    const data = {
      userId: user._id,
      feedUrl: 'https://rsshub.app/twitter/user/joebiden'
    }

    await supertest(app)
      .post('/api/v1/feeds')
      .send(data)
      .expect(201)
      .then((response) => {
        expect(response.body.feed._id).to.not.be.null
        expect(response.body.user._id).to.not.be.null
      })
  })
})

describe('PUT /api/v1/feeds/update', function() {
  it("it should update a feed's filterStrength value", async function() {
    const user = await db.User.findOne({ 
      username: 'user9', 
      email: 'user9@fake.com',
      password: 'password'
    })

    const data = {
      userId: user._id,
      feedId: user.feeds[0]._id,
      filterStrength: 2
    }

    await supertest(app)
      .put('/api/v1/feeds/update')
      .send(data)
      .expect(200)
      .then((response) => {
        expect(response.body.data.recordsAffected).to.be.equal(1)
        expect(response.body.data.user.feeds[0].filterStrength).to.be.equal(2)
      })
  })
})

describe('DELETE /api/v1/feeds/destroy', function() {
  it("it should delete a user's feed", async function() {
    const user = await db.User.findOne({ 
      username: 'user9', 
      email: 'user9@fake.com',
      password: 'password'
    })

    const data = {
      userId: user._id,
      feedId: user.feeds[0]._id,
    }

    await supertest(app)
      .delete('/api/v1/feeds/destroy')
      .send(data)
      .expect(200)
      .then((response) => {
        expect(response.body.data.user.feeds.length).to.be.equal(0)
      })
  })
})


describe('POST /api/v1/auth/register', function() { 
  it('it should create a new user', async function() { 
    const data = {
      username: 'test-user',
      email: 'test@user.com',
      password: 'password'
    }


     await supertest(app)
      .post('/api/v1/auth/register')
      .send(data)
      .expect(201)
      .then((response) => {
        expect(response.body.createdUser).to.not.be.null
      })
  })
})

describe('POST /api/v1/auth/login', function() { 
  it('it should log in a user', async function() { 
    const data = {
      username: 'test-user',
      email: 'test@user.com',
      password: 'password'
    }


     await supertest(app)
      .post('/api/v1/auth/login')
      .send(data)
      .expect(200)
      .then((response) => {
        expect(response.body.message).to.be.equal('Success')
        expect(response.body.user).to.not.be.null
      })
  })
})

describe('', function () {
  it('it should remove test users from database', async function() {
    const user = await db.User.findOne({
      email: 'test@user.com'
    })

    await user.delete()
    await supertest(app)
  })
})

describe('', function () {
  it('it should remove test users from database', async function() {
    const user = await db.User.findOne({ 
      username: 'user9', 
      email: 'user9@fake.com',
      password: 'password'
    })

    await user.delete()
    await supertest(app).then(process.exit())
  })
})

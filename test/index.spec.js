const supertest = require('supertest');
const assert = require('assert');

const app = require('../server');

describe('GET /api/v1/feeds', function() { 
  it('it should has status code 200', function(done) { 
     supertest(app)
      .get('/api/v1/feeds')
      .expect(200)
      .end(function(err, res){
        if (err) done(err);
        done();
      });
  })
})


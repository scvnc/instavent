const
  {expect} = require('chai'),
  {getTableSvc, put, get} = require('../src/storage.js')

describe('Storage Piece', function () {
  this.timeout(5*1000);

  it('should be able to get the azure service', function (done) {
    getTableSvc()
      .then(() => done())
      .catch(done);
  });

  it('should be able to put/retr', function (done) {

    const obj = {
      a: 'b',
      x: 2
    };
    
    put('f', obj) 
      .then(() => get('f'))
      .then(entity => {
        expect(entity).to.deep.equal(obj);
        done();
      })
      .catch(done);
  });

}); 

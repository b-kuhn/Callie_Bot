const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const sinon = require('sinon');

const maps = require('./../modules/maps.js');
const ninAPI = require('./../modules/ninAPI.js');

const fs = require('fs');

chai.use(chaiAsPromised);

var expect = chai.expect;

describe('The maps module', function(){
  it('handles fetching and parsing the maps JSON from ninAPI', function(){
    var getCurrentMapsStub = sinon.stub(ninAPI, "getCurrentMaps").callsFake(function(){
      return new Promise(function(resolve, reject){
        var t = JSON.parse(fs.readFileSync('./test/data.json'));
        resolve(t);
      });
    });
    var map = maps.current();
    var end_time = maps.current().then(data => end_time = data.end_time)
    return Promise.all([
      expect(map).to.eventually.have.property("end_time"),
      expect(end_time).to.eventually.equal(1502582400000)
    ]);
  });
})

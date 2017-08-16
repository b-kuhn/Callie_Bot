const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const sinon = require('sinon');

const maps = require('./../modules/maps.js');
const ninAPI = require('./../modules/ninAPI.js');
const time = require('./../modules/time.js');

const fs = require('fs');

chai.use(chaiAsPromised);

var expect = chai.expect;

var getCurrentMapsStub = sinon.stub(ninAPI, "getCurrentMaps").callsFake(function(){
  return new Promise(function(resolve, reject){
    var t = JSON.parse(fs.readFileSync('./test/data.json'));
    resolve(t);
  });
});
var timeUntilStub = sinon.stub(time, "timeUntil").callsFake(function(){return 1;});

describe('The maps module', function(){
  it('returns the current rotation of stages', function(){

    var map = maps.current();
    var end_time = maps.current().then(data => end_time = data.end_time)
    return Promise.all([
      expect(map).to.eventually.have.property("end_time"),
      expect(end_time).to.eventually.equal(1502582400000)
    ]);
  });

  it('returns the upcoming rotation of stages', function(){
    var nextGameMode = maps.next().then(data => nextGameMode = data.ranked.game_mode);
    return Promise.all([
      expect(nextGameMode).to.eventually.equal("Splat Zones")
    ])
  });

  it('returns the next N rotations of stages', function(){
    var next3Maps = maps.nextNMaps(3);
    return Promise.all([
      expect(next3Maps).to.eventually.be.an('array'), //TODO figure out how to test this better
      expect(next3Maps).to.have.lengthOf(3)
    ])
  });

  it('elegantly handles cases where currentMaps might be empty', function(){
    //TODO
  });
})

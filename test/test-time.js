//mocha.setup('bdd');
const expect = require('chai').expect;

const time = require('./../modules/time.js');

describe('The time module', function(){
  it('handles calculating the time until a future date.', function(){
    time.timeUntil.restore();
    var futureTime = 1534099656000;
    var pastTime = 1471027656000;

    var future = time.timeUntil(null, futureTime);
    var past = time.timeUntil(null, pastTime);
    var between = time.timeUntil(pastTime, futureTime);

    expect(future, "Future negative").to.be.above(0);
    expect(past,  "Past positive").to.be.below(0);
    expect(between).to.equal(63072000000);
  });

  it('converts a date to milliseconds.', function(){
    var milliseconds = time.dateToMilliseconds(0, 36, 47, 18, 12, 8, 2016);
    expect(milliseconds).to.equal(1471052856000);
  });
})

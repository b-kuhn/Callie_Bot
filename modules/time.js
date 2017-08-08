var exports = module.exports = {};

//Credits go to Miller_S for this one
exports.nextOddHour = function(){
  var d = new Date();
	var h = d.getHours();
	var m = d.getMinutes();
	var s = d.getSeconds();
	var ms = d.getMilliseconds();
	//determine the amount of hours
	h = (h % 2);
	m = 59 - m;
	s = 59 - s;
	ms = 999- ms;
	return (3600000 * h + 60000 * m + 1000 * s + ms);
}

var exports = module.exports = {};

/**
	Returns in milliseconds the amount of time between the time the function is called to the next odd hour
	@return (number) the amount of time in milliseconds
**/
exports.nextOddHour = function(){
	//get the current time
	var d = new Date();
	//convert time to milliseconds
	return dateToMilliseconds(999- d.getMilliseconds(),59 - d.getSeconds(),59 - d.getMinutes(),d.getHours() % 2,0,0,0);
}
	/**
	Returns in milliseconds the amount of time between the time the function is called and the time that is given
	@param (number) a date in epoch time
	@return (number) the amount of time in milliseconds
**/
	exports.timeUntil = function(futureTime){
		//get current time
		var d = new Date();
		/*make a date variable out of the epoch time.
		NOTE: The date object starts at 1900 instead of the epoch time of 1970 and uses milliseconds instead of seconds
				So we must multiply the epoch time and add a constant to line up the dates
		*/
		var f = new Date(futureTime * 1000 + 28800000);
		return dateToMilliseconds(f.getMilliseconds() - d.getMilliseconds(), f.getSeconds() - d.getSeconds(), f.getMinutes() - d.getMinutes(),
									f.getHours() - d.getHours(), f.getDay() - d.getDay(), f.getMonth() - d.getMonth(), f.getYear() - d.getYear());
	}

  /**
    Returns in milliseconds the amount of time given
    @param (number) number of milliseconds
    @param (number) number of seconds
    @param (number) number of minutes
    @param (number) number of hours
    @param (number) number of days
    @param (number) number of months
    @param (number) number of years
    @return (number) the amount of time in milliseconds
  **/
  function dateToMilliseconds(ms, s, min,h,d,months,y){
		return ((y * 31557600000) + (months * 2629800000) + (d * 86400000) + (3600000 * h) + (60000 * min) + (1000 * s) + ms);
	}
  exports.dateToMilliseconds = function(ms, s, min, h, d, months, y){
    dateToMilliseconds(ms, s, min, h, d, months, y);
  }

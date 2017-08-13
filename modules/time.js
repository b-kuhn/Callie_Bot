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
* Determines the time until a future date (in ms) from the current or a past date
* @param (number) epoch time of the current time (or the first time when comparing against two different time stamps)
* @param (number) epoch time of the future time
* @return (number) number of ms between the two given times
*/
exports.timeUntil = function(currentTime, futureTime){
	//get current time
	var d = (currentTime != null) ? new Date(currentTime) : new Date();
	//Set future time
	var f = new Date(futureTime);
	return f - d;
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
	months -= 1; //TODO reformat this to include the fact everything starts from 0
	return new Date(y, months, d, h, min, s, ms).getTime();
}
exports.dateToMilliseconds = function(ms, s, min, h, d, months, y){
  return dateToMilliseconds(ms, s, min, h, d, months, y);
}

/*
* Gets and formats the elapsed time from the ms passed into it
* Highly un-optimized
*/
exports.getElapsedTime = function(time_in_ms){
  var message = "";

  var year = Math.floor(time_in_ms / 31557600000);
  if(year != 0) time_in_ms -= year * 31557600000;
  message += (year === 0 ? "" : year + " years, ");

  var month = Math.floor(time_in_ms / 2629800000);
  if(month != 0) time_in_ms -= month * 2629800000;
  message += (month === 0 ? "" : month + " months, ");

  var day = Math.floor(time_in_ms / 86400000);
  if(day != 0) time_in_ms -= day * 86400000;
  message += (day === 0 ? "" : day + " days, ");

  var hour = Math.floor(time_in_ms / 3600000);
  if(hour != 0) time_in_ms -= hour * 3600000;
  message += (hour === 0 ? "" : hour + " hours, ");

  var minute = Math.floor(time_in_ms / 60000);
  if(minute != 0) time_in_ms -= minute * 60000;
  message += (minute === 0 ? "" : minute + " minutes, ");

  var second = Math.floor(time_in_ms / 1000);
  message += (second === 0 ? "" : second + " seconds. ");

  return message;
}

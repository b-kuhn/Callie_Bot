var exports = module.exports = {};
const ninAPI = require('./ninAPI.js');
const time = require('./time.js');
const log = require('./log.js');

var currentMaps = [];

/*
* Returns the current map rotation
*/
exports.current = function(){
  return new Promise(function(resolve){
    resolve(next());
  });
}

function next(){
  //Refresh the maps list before purging the last rotation
  return new Promise(function(resolve){
    if (currentMaps.length <= 1){
      ninAPI.getCurrentMaps().then(function(maps){
        parse(maps);
        purgeOldRotation();
        resolve(currentMaps[0]);
      });
    } else {
      purgeOldRotation();
      resolve(currentMaps[0]);
    }
  });
}

/*
* Parses the useless information out of the JSON that is returned from the ninAPI
*/
function parse(maps){
  currentMaps = [];
  for(var i = 0; i < maps.gachi.length; i++){
    currentMaps.push({
      ranked: {
        game_mode: maps.gachi[i].rule["name"],
        map_a: maps.gachi[i].stage_a["name"],
        map_b: maps.gachi[i].stage_b["name"]
      },
      regular: {
        game_mode: "Turf War", //Regular Battles are always Turf War at this point
        map_a: maps.regular[i].stage_a["name"],
        map_b: maps.regular[i].stage_b["name"]
      },
      league: {
        game_mode: maps.league[i].rule["name"],
        map_a: maps.league[i].stage_a["name"],
        map_b: maps.league[i].stage_b["name"]
      },
      end_time: maps.gachi[i].end_time * 1000
    });
  }
}

/*
* Checks the current maps array and removes any rotations that are done
*/
function purgeOldRotation(){
  var spliced = [];
  var current = 0;
  //if all goes well, this either will not loop or loop exactly once
  while(time.timeUntil(null, currentMaps[current].end_time) <= 0) current++;
  //Splice out the old maps
  spliced = currentMaps.splice(0, current);
  if(log.logging) log.write(spliced); //TODO properly format the array for easier viewing on the log
  if(log.logging && current > 1) log.write("Warning. Looped more than once in purgeOldRotation."); //log if we looped multiple times
}

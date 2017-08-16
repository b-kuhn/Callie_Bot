var exports = module.exports = {};
const ninAPI = require('./ninAPI.js');
const time = require('./time.js');
const log = require('./log.js');

var currentMaps = [];

/**
* Returns the current map rotation
*/
exports.current = function(){
  return new Promise(function(resolve){
    getMaps(1).then(function(){
      resolve(currentMaps[0]);
    })
  });
}

/**
* Returns the next map rotation
*/
exports.next = function(){
  return new Promise(function(resolve){
    getMaps(2).then(function(){
      resolve(currentMaps[1]);
    })
  })
}

/**
* Returns the next n map roations
* @param (number) The number of maps that need to be returned
*/
exports.nextNMaps = function(numMaps){
  if(numMaps > 12) numMaps = 12; //Can only fetch 12 rotations, limitation of ninAPI
  return new Promise(function(resolve){
    getMaps(numMaps).then(function(){
      var maps = [];
      for(var i = 1; i <= numMaps; i++) maps.push(currentMaps[i]);
      resolve(maps);
    })
  })
}

/**
* Refreshes the currentMaps array to the most up to date info
*/
exports.refresh = function(){
  return new Promise(function(resolve){
    getMaps(1).then(function(){
      resolve("Maps refreshed.");
    })
  })
}

/**
* Clears the currentMaps array
*/
exports.clear = function(){
  currentMaps = [];
}

/**
* Returns the currentMaps object
*/
exports.raw = function(){
  return currentMaps;
}

/**
* Fetches the current maps and returns the first
* @param (number) the number of maps we need to return later
*/
function getMaps(numMaps){
  //Refresh the maps list before purging the last rotation
  purgeOldRotation();
  return new Promise(function(resolve){
    if (currentMaps.length < numMaps){
      ninAPI.getCurrentMaps().then(function(maps){
        parse(maps);
        resolve(currentMaps[0]);
      });
    } else {
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
    purgeOldRotation(); //there *shouldn't* be any old maps, but just incase we'll run this again.
  }
}

/*
* Checks the current maps array and removes any rotations that are done
*/
function purgeOldRotation(){
  var spliced = [];
  var current = 0;
  //if all goes well, this either will not loop or loop exactly once (if on a 2hour auto post schedule)
  while(current < currentMaps.length && time.timeUntil(null, currentMaps[current].end_time) <= 0) current++;
  //Splice out the old maps
  spliced = currentMaps.splice(0, current);
  if(log.logging) log.write(spliced); //TODO properly format the array for easier viewing on the log
  if(log.logging && current > 1) log.write("Warning. Looped more than once in purgeOldRotation."); //log if we looped multiple times
}

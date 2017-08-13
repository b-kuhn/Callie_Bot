//class to format various posts into a human friendly format
var exports = module.exports = {};

/**
* Formats the information stored in maps.js into a human friendly format
* @param (object) Object containing the necessary map posts
*/
exports.formatMapPost = function(post){
  var message = "The current stages are: "
  message += "\nRegular: **Turf War** - " + post.regular.map_a + " - " + post.regular.map_b;
  message += "\nRanked: **" + post.ranked.game_mode + "** - " + post.ranked.map_a + " - " + post.ranked.map_b;
  message += "\nLeague: **" + post.league.game_mode + "** - " + post.league.map_a + " - " + post.league.map_b;
  return message;
}

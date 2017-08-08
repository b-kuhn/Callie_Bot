var exports = module.exports = {};

var config = require('./../config.js')
var client_id = config.client_id;
var resource_id = config.resource_id;
var init_session_token = config.init_session_token;

var request = require('request-promise');
//require('request-debug')(request);

var currentMaps = null;

exports.getCurrentMaps = function(){
  return new Promise(function(resolve, reject){

    var maps = {};
    getAPIToken().then(function(api_tokens){
      return api_tokens;
    }).then(function(api_tokens){
      return getAccountToken(api_tokens)
    }).then(function(account_tokens){
      return getWebTokens(account_tokens);
    }).then(function(web_tokens){
      return getIKSM(web_tokens);
    }).then(function(iksm){
      return getMaps(iksm)
    }).then(function(mapsJSON){
      maps = mapsJSON;
      if(maps != {}){
        resolve(maps);
      } else {
        reject(Error("Unable to get maps."));
      }
    })
  })
}

/*
* The start of all the call backs. This gets the initial set of API tokens needed for subsequent calls.
*/
function getAPIToken(){
  //generate the promise
  return new Promise(function(resolve, reject){
    var api_tokens = {};
    //used to send various parameters to the end point
    var myJSON = {
      "client_id": client_id,
      "grant_type": "urn:ietf:params:oauth:grant-type:jwt-bearer-session-token",
      "session_token": init_session_token
    }
    //generate the request options
    var options = {
      url: "https://accounts.nintendo.com/connect/1.0.0/api/token",
      method: 'POST',
      json: true,
      body: myJSON
    }

    request(options).then(function(resp){
      api_tokens = resp;
      //if the tokens are not empty continue TODO handle errors better
      if(api_tokens != {}){
        resolve(api_tokens);
      } else {
        reject(Error("Unable to get api tokens"));
      }
    });
  });
}

/*
* This uses the api_tokens we previously acquired to get our account tokens.
*/
function getAccountToken(api_tokens){
  //generate the promise
  return new Promise(function(resolve, reject){
    var tokens = {};
    //used to send various parameters over to the end point
    //since we are using the GetToken end point the first three values are null
    var myJSON = {
      "parameter": {
        "language": null,
        "naBirthday": null,
        "naCountry": null,
        "naIdToken": api_tokens.id_token
      }
    }
    //generate the options used in the request
    var options = {
      url: "https://api-lp1.znc.srv.nintendo.net/v1/Account/GetToken",
      method: "POST",
      headers: {
        'Authorization': "Bearer " + api_tokens.access_token,
        "User-Agent": "com.nintendo.znca/1.0.4 (Android/7.0)"
      },
      json: true,
      body: myJSON
    }
    //make the actual request
    request(options).then(function(resp){
      tokens = resp;
      if(tokens != {}) {
        resolve(tokens);
      } else {
        reject(Error("Unable to get account tokens"));
      }
    });
  });
}

/*
* Used to get the tokens for the web service. Uses the account tokens previously acquired.
*/
function getWebTokens(tokens){
  //generate the promise
  return new Promise(function(resolve, reject){
    var web_tokens = {};
    //used to send various parameters to the end point
    var myJSON = {
      "parameter": {"id": resource_id}
    }
    //set the options for the request
    var options = {
      url: "https://api-lp1.znc.srv.nintendo.net/v1/Game/GetWebServiceToken",
      method: "POST",
      headers: {
        'Authorization': "Bearer " + tokens.result.webApiServerCredential.accessToken,
        "User-Agent": "com.nintendo.znca/1.0.4 (Android/7.0)"
      },
      json: true,
      body: myJSON
    }
    //make the actual request
    request(options).then(function(resp){
      web_tokens = resp;
      if(web_tokens.status == 0) {
        resolve(web_tokens);
      } else {
        reject(Error("Unable to get web tokens."))
      }
    })
  });
}

/*
* Used to get the iksm token needed to get the maps. Uses the web tokens previously acquired.
*/
function getIKSM(web_tokens){
  //generate the promise
  return new Promise(function(resolve, reject){
    var iksm = "1";
    //used to send various parameters to the end point
    var myJSON = {
      //none needed
    }
    //generate the options for the request
    var options = {
      url: "https://app.splatoon2.nintendo.net/?lang=en-US",
      headers: {'X-gamewebtoken': web_tokens.result.accessToken},
      resolveWithFullResponse: true,
      json: true
    }
    //send the actual request
    request(options).then(function(resp){
      iksm = resp.headers.getByIndex(7)[0].split(";")[0];
      if(iksm !== ""){
        resolve(iksm);
      } else {
        reject(Error("Unable to get iksm."));
      }
    })
  });
}

/*
* Actually makes the HTML request for the current maps. Needs the iksm.
*/
function getMaps(iksm){
  //generate the promise
  return new Promise(function(resolve, reject){
    var map = {};
    //generate the options for the request
    var options = {
      url: "https://app.splatoon2.nintendo.net/api/schedules",
      headers: {'accept': 'application/json', 'Cookie': iksm},
      json: true
    }
    // send the actual request
    request(options).then(function(resp){
      maps = resp;
      if(maps != {}){
        resolve(maps);
      } else {
      reject(Error("Unable to get maps."))
      }
    })
  });
}

// Function to get the nth key from the object
Object.prototype.getByIndex = function(index) {
  return this[Object.keys(this)[index]];
};

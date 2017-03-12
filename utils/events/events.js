var request = require('request');
var parseString = require('xml2js').parseString;

function stripPrefix(str) {
  return str.replace(':', '');
}

module.exports = {
  eventSearch: function(title, callback){
    request({
      url: 'http://ruevents.rutgers.edu/events/getEventsRss.xml',
      method: 'GET',
      qs: {keyword: title},
    }, function (error, response, body){
      if (error){
        console.log(error);
        callback(new Error("events api error"), null);
      } else {
        parseString(response.body, {explicitArray: false, tagNameProcessors: [stripPrefix]}, function (err, result){
          console.log("in parser callback");
          if (err){
            console.log(err);
            callback(new Error("xml parser error"), null);
          } else {
            callback(null, result);
          }
        });
      }
    });
  }
}

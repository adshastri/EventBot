var express = require('express');
var router = express.Router();
var xml2js = require('xml2js');
var parser = new xml2js.Parser({explicitArray: false});
var request = require('request');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.send('home page');
});

router.get('/directions', function(req, res, next){

  request({
    url: 'http://ruevents.rutgers.edu/events/getEventsRss.xml',
    method: 'GET',
    qs: {keyword: 'Congressman'},
  }, function (error, response, body){
    if (error){
      console.log(error);
    } else {
      parser.parseString(response.body, function (err, result){
        res.send(result);
      });

    }
  });
});

module.exports = router;

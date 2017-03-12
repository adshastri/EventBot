var express = require('express');
var router = express.Router();

var bus = require('../utils/bus');
var geo = require('../utils/geo');
var events = require('../utils/events');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.send('home page');
});

router.get('/directions', function(req, res, next){
  events.eventSearch(req.query.keyword, function(err, result){
    if (!err){
      var place = result.rss.channel.item.eventlocation;
      geo.coords(place, function(err, result){
        if (!err){
          res.send(result);
        } else {
          console.log(err);
        }
      });
    } else {
      console.log(err);
    }
  });


});

module.exports = router;

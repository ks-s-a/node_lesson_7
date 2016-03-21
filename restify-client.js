var util = require('util');
var restify = require('restify');

var client = restify.createJsonClient({
  url: 'http://maps.google.com/'
});

client.get('/maps/api/geocode/json?address=Moscow+Red+Square', 
  function (err, req, res, obj) {
    if (err)
      console.error(err);
    else
      console.log(obj.results[0].formatted_address); 
  });

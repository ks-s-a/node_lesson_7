var restify = require('restify');
var util = require('util');

var client = restify.createJsonClient({
  url: 'http://maps.google.com/'
});

client.get('/maps/api/geocode/json?address=Moscow+Red+Square', 
  function (err, req, res, obj) {
    if (err)
      throw new Error(err);

    console.log(util.inspect(obj, {depth: null}));
  });

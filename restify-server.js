var util = require('util');
var restify = require('restify');

var cars = [];

rest = restify.createServer({
  name: 'ProgSchool'
});

rest.use(restify.authorizationParser());
rest.use(restify.queryParser());
rest.use(restify.bodyParser());
rest.use(restify.gzipResponse());

rest.use(function(req, res, next) {
  if (req.headers.origin)
    res.header('Access-Control-Allow-Origin', req.headers.origin);
  
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Headers', 'Authorization, X-Requested-With, Cookie, Set-Cookie, Accept, Access-Control-Allow-Credentials, Origin, Content-Type, Request-Id , X-Api-Version, X-Request-Id');
  res.header('Access-Control-Expose-Headers', 'Set-Cookie');

  return next();
});

rest.opts('.*', function(req, res, next) {
  if (req.headers.origin && req.headers['access-control-request-method']) {
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-Requested-With, Cookie, Set-Cookie, Accept, Access-Control-Allow-Credentials, Origin, Content-Type, Request-Id , X-Api-Version, X-Request-Id');
    res.header('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, DELETE');
    res.send(204);
  } else {
    res.send(404); 
  }

  return next();
});

rest.use(function(req, res, next) {
  if (req.path().indexOf('/protected') !== -1) {
    var auth = req.authorization;

    if (auth.scheme == null) {
      res.header('WWW-Authenticate', 'Basic realm="Please login"');
      return res.send(401);
    } 

    console.log('login: ' + auth.basic.username);
    console.log('password: ' + auth.basic.password);

    // checking login and password

    return next();
  }

  return next();
});

rest.get('/', function(req, res) {
  res.send(200, {result: "OK"});
});

rest.get('/protected/cars', function (req, res) {
  res.status(200);
  res.send({
    result: cars,
  });
});

rest.post('/protected/cars', function (req, res) {
  if (req.params && req.params.type && req.params.brand) {
    cars.push({
      id: cars.length + 1,
      type: req.params.type,
      brand: req.params.brand,
    });
  } else {
    res.status(404);
  }

  res.status(200);
  res.send({result: 'ok!'});
});

rest.get('/protected/cars/:id', function (req, res, next) {
  var id = +req.params.id;
  var car = cars.filter(function (v) {
    return v.id === id;
  })[0];

  // if (!id) {
  //   res.status(200);
  //   res.send({
  //     result: cars,
  //   });
  // } 
  if (!car) {
    res.status(404);
    return res.send('Нет такой машины!');
  } else {
    res.status(200);
    res.send({
      result: car
    });
  }
});

rest.patch('/protected/cars/:id', function (req, res, next) {
  if (!req.params.type || !req.params.brand) {
    res.status(400);
    return res.send('Некорректный запрос!');
  }

  var id = +req.params.id;
  var carIndex;
  var car = cars.filter(function (v, i) {
    if (v.id === id) {
      carIndex = i;
      return true;
    }
    return false;
  })[0];

  if (!car) {
    res.status(404);
    return res.send('Нет такой машины!');
  }

  cars[carIndex] = {
    id: car.id,
    type: req.params.type,
    brand: req.params.brand
  };

  res.status(200);
});

rest.get('/redirect', function(req, res) {
  res.setHeader('Location', 'http://google.ru');
  res.send(301);
});

rest.get('/protected/export/:format', function(req, res) {
  res.send(200, {result: req.params.format});
});

rest.post('/protected/import', function(req, res) {
  res.send(200, {result: "imported!", data: req.params});
});

rest.listen(8080, function() {
  console.log('API launched');
});

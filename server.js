var restify = require('restify');

var rest = restify.createServer({
  name: 'server-with-auth',
});

rest.use(restify.authorizationParser());
rest.use(restify.queryParser());
rest.use(restify.bodyParser());
rest.use(restify.gzipResponse());

rest.use(function(req, res, next) {
  if (req.path().indexOf('/protected') === -1)
    return next();

  var auth = req.authorization;
  if (auth.scheme == null) {
    res.header('WWW-Authenticate', 'Basic realm="Please login"');
    return res.send(401);
  } 

  console.log('login: ' + auth.basic.username);
  console.log('password: ' + auth.basic.password);

  // checking login and password

  return next();
});

rest.get('/', function(req, res) {
  return res.send(200, {result: "OK"});
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
  console.log('API launched on 8080 port');
});

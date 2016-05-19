// Пример простого сервера на restify
// с http авторизацией

var restify = require('restify');

var rest = restify.createServer({
  name: 'server-with-auth',
});

// Необходимые серединки для обработки данных
rest.use(restify.authorizationParser());
rest.use(restify.queryParser());
rest.use(restify.bodyParser());
rest.use(restify.gzipResponse());

// Дополнительная серединка для проверки аутентификации
rest.use(function(req, res, next) {
  // Проверка на "защищенную зону"
  if (req.path().indexOf('/protected') === -1)
    return next();

  // Проверяем авторизацию пользователя
  var auth = req.authorization;
  if (auth.scheme == null) { // Не авторизован
    // Предлагаем залогинится
    res.header('WWW-Authenticate', 'Basic realm="Please login"');
    return res.send(401);
  } 

  // Выводим введеный пользователем логин и пароль
  console.log('login: ' + auth.basic.username);
  console.log('password: ' + auth.basic.password);

  // Здесь пишем обработку логина и пароля

  return next();
});

rest.get('/', function(req, res) {
  return res.send(200, {result: "OK"});
});

// Пример перенаправления
rest.get('/redirect', function(req, res) {
  res.setHeader('Location', 'http://google.ru');
  res.send(301);
});

// Защищенная зона
rest.get('/protected/export/:format', function(req, res) {
  res.send(200, {result: req.params.format});
});

rest.post('/protected/import', function(req, res) {
  res.send(200, {result: "imported!", data: req.params});
});

rest.listen(8080, function() {
  console.log('API launched on 8080 port');
});

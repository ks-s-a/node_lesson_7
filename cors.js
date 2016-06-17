// Пример работы с CORS
var restify = require('restify');

var rest = restify.createServer({
  name: 'cors-server',
});

rest.use(restify.gzipResponse());

// Любому запросу прописываем разрешение на работу 
// с пользовательскими данными
rest.use(function(req, res, next) {
  // Разрешаем обрабатывать ответ
  res.header('Access-Control-Allow-Origin', req.headers.origin);

  // Разрешаем обрабатывать пользовательские данные
  res.header('Access-Control-Allow-Credentials', 'true');
  next();
});

// Определяем обработку предварительных запросов
rest.opts('.*', function(req, res, next) {
  res.header('Access-Control-Allow-Origin', req.headers.origin);
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Headers', 'Authorization, X-Requested-With, Cookie, Set-Cookie, Accept, Access-Control-Allow-Credentials, Origin, Content-Type, Request-Id , X-Api-Version, X-Request-Id');
  res.header('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PATCH, PUT, DELETE');
  
  res.send(204);
});

rest.get('/', function(req, res) {
  return res.send(200, {result: "OK"});
});

rest.listen(8000, function() {
  console.log('API launched on 8000 port');
});

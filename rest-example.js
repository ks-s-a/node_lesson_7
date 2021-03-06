// Пример RESTfull API

var restify = require('restify');

// Определяем коллекцию для хранения данных
var cars = [];

var rest = restify.createServer({
  name: 'rest-example'
});

rest.use(restify.queryParser());
rest.use(restify.bodyParser());
rest.use(restify.gzipResponse());

rest.get('/', function(req, res) {
  return res.send(200, {result: "OK"});
});

// Получаем данные о коллекции
rest.get('/cars', function (req, res) {
  return res.send(200, {
    result: cars,
  });
});

// Создаем элемент в коллекции
rest.post('/cars', function (req, res) {
  if (!req.params || !req.params.type || !req.params.brand)
    return res.send(400, {});

  cars.push({
    id: cars.length + 1,
    type: req.params.type,
    brand: req.params.brand,
  });

  res.send(200, {result: 'ok!'});
});

// Удаляем элемент в коллекции
rest.del('/cars/:id', function (req, res) {
  var id = +req.params.id;
  var car = cars.filter(function (v) {
    return v.id === id;
  })[0];

  if (!car)
    return res.send(404, 'Нет такой машины!');

  cars = cars.filter(function(value) {
    return value.id !== id;
  });

  return res.send(200, {
    result: 'ok!',
  });
});

// Получаем информацию об элементе коллекции
rest.get('/cars/:id', function (req, res) {
  var id = +req.params.id;
  var car = cars.filter(function (v) {
    return v.id === id;
  })[0];
 
  if (!car)
    return res.send(404, 'Нет такой машины!');

  res.send(200, {
    result: car
  });
});

// Изменяем информацию об элементе коллекции
rest.put('/cars/:id', function (req, res) {
  if (!req.params.type || !req.params.brand)
    return res.send(400, 'Некорректный запрос!');

  var id = +req.params.id;
  var carIndex = -1;
  cars.forEach(function (v, i) {
    if (v.id === id)
      carIndex = i;
  });

  if (carIndex === -1)
    return res.send(404, 'Нет такой машины!');

  cars[carIndex] = {
    id: id,
    type: req.params.type,
    brand: req.params.brand,
  };

  return res.send(200, {
    result: 'ok!',
  });
});

rest.listen(8000, function() {
  console.log('API launched on 8000 port');
});

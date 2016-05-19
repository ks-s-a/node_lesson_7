// Создание клиента для работы с API
var restify = require('restify');

// Создаем сервер, определяем точку входа в API
var client = restify.createJsonClient({
  url: 'https://cars.mail.ru/bcache'
});

// Делаем запрос
client.get('/sale/sale_wizard_form_controller_aj/?body_type=4&firm_id=98&price=300000-1200000&provoker=firm_id', 
  function (err, req, res, obj) {
    if (err)
      throw new Error(err);

    // Выводим данные, не ограничивая их по уровню вложенности
    console.dir(obj, {depth: null});
  });

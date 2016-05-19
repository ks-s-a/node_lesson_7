var restify = require('restify');

var client = restify.createJsonClient({
  url: 'https://cars.mail.ru/bcache'
});

client.get('/sale/sale_wizard_form_controller_aj/?body_type=4&firm_id=98&price=300000-1200000&provoker=firm_id', 
  function (err, req, res, obj) {
    if (err)
      throw new Error(err);

    console.dir(obj, {depth: null});
  });

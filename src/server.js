const 
  uuid = require('node-uuid');
  express = require('express'),

  storage = require('./storage.js'),

  bodyParser = require('body-parser'),

  app = express();

  app.use(bodyParser.json())

  app.get('/invite/:id', (req, res) => {
    let {id} = req.params;

    storage.get(id)
      .then(invite => res.send(invite))
      .catch(err => res.send(err));
  });

  app.put('/invite/:id', (req, res) => {

    let
      {id} = req.params,
      {body} = req;
    
    storage.put(id, body)
      .then(() => res.sendStatus(200))
      .catch((err) => {console.log(err);res.sendStatus(500)});
    
  });
  

app.listen(3000);
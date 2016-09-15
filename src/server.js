const 
  path = require('path'),
  uuid = require('node-uuid'),
  express = require('express'),

  storage = require('./storage.js'),

  bodyParser = require('body-parser'),

  nunjucks = require('nunjucks'),

  app = express();

  nunjucks.configure(path.resolve(__dirname, 'static'), {
    autoescape: true,
    express: app
  });

  app.use(express.static(path.resolve(__dirname, 'static')));
  app.use('/node_modules', express.static(path.resolve(__dirname, '..', 'node_modules')));

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({extended:false}));

  //
  //// Routes
  //

  app.get('/', (req, res) => {
    res.redirect('/create-event-form');
  })

  app.get('/create-event-form', (req, res) => {
    res.render('index.html');
  });

  app.post('/event', (req, res) => {

    // This is the information from the form.
    let {eventtitle, date, owneremail, Games, participants} = req.body;


    res.send(req.body);


    


  });

  app.get('/event/:id')

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
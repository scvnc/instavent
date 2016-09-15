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
    express: app,
    noCache: true
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

    let parsedParticipants = (participants.match(/[^\r\n]+/g) || [])
      .map(p => {

        const [name, email] = p.split(" ");

        return {
          name, 
          email, 
          inviteCode: uuid.v4(), 
          response: null
        }
      });

    let event = {
      id: uuid.v1(),
      title: eventtitle,
      date,
      ownerEmail: owneremail,
      games: Games.match(/[^\r\n]+/g) || [],
      participants: parsedParticipants
    };

    storage.put(event.id, event)
      .then(() => res.redirect(`/event/${event.id}`))
      .catch(e => res.status(500).send(e.toString()));
    
  });

  app.get('/event/:id', (req, res) => {

    storage.get(req.params.id)
      .then(data => {
        res.render('results.html', data);
      })
      .catch(() => res.sendStatus(404));

  });


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
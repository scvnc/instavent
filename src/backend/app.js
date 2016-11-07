// @flow

import path from 'path'; 

import gravatar from 'gravatar';

import uuid from 'node-uuid';
import storage from './storage.js';

import Koa from 'koa';
import Router from 'koa-router';
import views from 'koa-views';
import serveStatic from 'koa-static';
import bodyParser from 'koa-bodyparser';

const STATIC_DIR = path.resolve(__dirname, '..', 'static');

const 
  app = new Koa(),
  router = new Router();

// Configure nunjucks
app.use(views(STATIC_DIR, {
  map: { html: 'nunjucks' },
  options: {
    noCache: true
  }
}));

// Static files
app.use(serveStatic(STATIC_DIR));
router.use('/node_modules', serveStatic(path.resolve(__dirname, '..', 'node_modules')));

app.use(bodyParser());

//
//// Routes
//

router.get('/', (ctx) => {
  ctx.redirect('/create-event-form');
})

router.get('/create-event-form', async (ctx) => {
  await ctx.render('index.html');
});

router.post('/event', async (ctx) => {

  const {eventtitle, date, 
    owneremail, Games, participants} = (ctx.request.body : CreateEventDTO);

  let parsedParticipants : Array<Invite> = (participants.match(/[^\r\n]+/g) || [])
    .map((p : string) => {

      const [name, email] = p.split(" ");

      return {
        name, 
        email, 
        inviteCode: uuid.v4(), 
        response: '?'
      };
      
    });

  let event : Event = {
    id: uuid.v1(),
    title: eventtitle,
    date,
    ownerEmail: owneremail,
    games: Games.match(/[^\r\n]+/g) || [],
    participants: parsedParticipants
  };

  await storage.put(event.id, event)
  
  ctx.response.redirect(`/event/${event.id}`);

});

router.get('/event/:id', async ctx => {

  let data: Event = await storage.get(ctx.params.id);
  
  const {participants, date, title} = data;
  
  let participantVMs = participants.map(p => {
    return Object.assign({}, p, {
      imgUrl: gravatar.url(p.email)
    });
  });

  let vm : ResultsViewModel = {

    title,
    date,
    
    confirmed: participantVMs.filter(p => p.response === 'y'),
    declined: participantVMs.filter(p => p.response === 'n'),
    unknown: participantVMs.filter(p => p.response === '?')
  };

  await ctx.render('results.html', vm);
});

router.put('/invite/:id', (req, res) => {

  let
    {id} = req.params,
    {body} = req;
  
  storage.put(id, body)
    .then(() => res.sendStatus(200))
    .catch((err) => {console.log(err);res.sendStatus(500)});
  
});

app.use(router.routes());
app.listen(3000);
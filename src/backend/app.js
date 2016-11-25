// @flow

import Koa from 'koa';
import Router from 'koa-router';
import views from 'koa-views';
import serveStatic from 'koa-static';
import bodyParser from 'koa-bodyparser';

import path from 'path'; 
import gravatar from 'gravatar';
import uuid from 'node-uuid';
import storage from './storage.js';
import nunjucks from 'nunjucks';

const 

  STATIC_DIR = path.resolve(__dirname, '..', 'static'),

  app = new Koa(),
  router = new Router();

// Configure nunjucks
app.use(views(STATIC_DIR, {
  map: { html: 'nunjucks' },
  options: {
    nunjucksEnv: nunjucks.configure(STATIC_DIR, {noCache: true})
  }
}));


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

  let {inviteCode} = ctx.query;
  let {id} = ctx.params;
  let data: Event = await storage.get(id);

  const {participants, date, title} = data;
  
  let participantVMs = participants.map(p => {
    return Object.assign({}, p, {
      imgUrl: gravatar.url(p.email)
    });
  });

  let vm : ResultsViewModel = {

    eventId: id,
    inviteCode,

    title,
    date,
    
    confirmed: participantVMs.filter(p => p.response === 'y'),
    declined: participantVMs.filter(p => p.response === 'n'),
    unknown: participantVMs.filter(p => p.response === '?')
  };

  await ctx.render('results.html', vm);
});


router.post('/event/:id/participant/:inviteCode/response', async ctx => {
 
  let data : Event = await storage.get(ctx.params.id);

  let idx = data.participants
    .findIndex(p => p.inviteCode === ctx.params.inviteCode);
    
  data.participants[idx].response = 'y';
  
});


// Static files
app.use(serveStatic(STATIC_DIR, {index: 'null'}));
router.use('/node_modules', serveStatic(path.resolve(__dirname, '..', 'node_modules')));

app.use(router.routes());



export default app;

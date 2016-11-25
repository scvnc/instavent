type CreateEventDTO = {
  eventtitle: string,
  date: string,
  date_submit: string,
  owneremail: string,
  Games: string,
  participants: string
}

type Event = {
  id: string,
  title: string,
  date: string,
  ownerEmail: string,
  games: Array<string>,
  participants: Array<Invite>
}

type Invite = {
  name: string,
  email: string,
  response: 'y' | 'n' | '?',
  inviteCode: string
}

type InviteVM = Invite & {
  imgUrl: string
}

type ResultsViewModel = {

  eventId: string,
  inviteCode: ?string,

  title: string,
  date: string,

  confirmed: Array<InviteVM>,
  declined: Array<InviteVM>,
  unknown: Array<InviteVM>
}
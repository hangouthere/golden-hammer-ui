export type SimulatedEventHandler = (username: string) => object;

const randBetween = (low: number, high: number): number => Math.round(Math.random() * (high - low) + low);

const defaultMessageEvent = {
  color: '#FF69B4',
  emotes: null,
  'first-msg': false,
  flags: null,
  turbo: false,
  'room-id': '154746377',
  'user-id': '154746743',
  'user-type': 'mod',
  'emotes-raw': null,
  'message-type': 'chat',
  id: '09cd056d-926b-4253-b70e-1e44ba163b30',
  'tmi-sent-ts': '1646966311484',
  mod: true,
  subscriber: true,
  'badge-info': { subscriber: '2' },
  badges: { moderator: '1', subscriber: '0' },
  'badge-info-raw': 'subscriber/2',
  'badges-raw': 'moderator/1,subscriber/0'
};

const SimulatedEvents: Record<string, SimulatedEventHandler> = {
  'PlatformSpecific: Clear Chat': (username: string) => ({ platformEventName: 'clearchat', platformEventData: [] }),
  'PlatformSpecific: Emote Only Off': (username: string) => ({
    platformEventName: 'emoteonly',
    platformEventData: [false]
  }),
  'PlatformSpecific: Emote Only On': (username: string) => ({
    platformEventName: 'emoteonly',
    platformEventData: [true]
  }),
  'PlatformSpecific: Subscribes Only Off': (username: string) => ({
    platformEventName: 'subscribers',
    platformEventData: [false]
  }),
  'PlatformSpecific: Subscribes Only On': (username: string) => ({
    platformEventName: 'subscribers',
    platformEventData: [true]
  }),
  'PlatformSpecific: Hosted': (username: string) => ({
    platformEventName: 'hosted',
    platformEventData: [username, 0, false]
  }),
  'Presence: Join': (username: string) => ({ platformEventName: 'join', platformEventData: [username, false] }),
  'Presence: Part': (username: string) => ({ platformEventName: 'part', platformEventData: [username, false] }),

  'Message: Chat Message 1': (username: string) => ({
    platformEventName: 'chat',
    platformEventData: [
      {
        ...defaultMessageEvent,
        'display-name': username,
        username: username,
        'emotes-raw': '306340318:86-95',
        emotes: { 306340318: ['86-95'] }
      },
      'This is a Simulated Chat Message, brought to you by @nfgcodex at http://nfgarmy.com | nfgcodArmy 🤓',
      false
    ]
  }),

  'Message: Chat Message 2': (username: string) => ({
    platformEventName: 'chat',
    platformEventData: [
      {
        ...defaultMessageEvent,
        'display-name': username,
        username: username
      },
      '😂💀👻👶😂💀👻',
      false
    ]
  }),

  'Message: Chat (Action)': (username: string) => ({
    platformEventName: 'action',

    platformEventData: [
      {
        'badge-info': { subscriber: '25' },
        badges: { moderator: '1', subscriber: '24', glitchcon2020: '1' },
        color: '#EFFF00',
        'display-name': username,
        'first-msg': false,
        flags: null,
        id: 'ba3660d4-35b7-4d0d-b686-290af99be0bf',
        mod: true,
        'room-id': '94753024',
        subscriber: true,
        'tmi-sent-ts': '1647287056230',
        turbo: false,
        'user-id': '55367418',
        'user-type': 'mod',
        'badge-info-raw': 'subscriber/25',
        'badges-raw': 'moderator/1,subscriber/24,glitchcon2020/1',
        username: username,
        'message-type': 'action'
      },
      'Chat Action Simulation!',
      false
    ]
  }),
  'Admininistration: User Ban': (username: string) => ({
    platformEventName: 'ban',

    platformEventData: [
      username,
      null,
      { 'room-id': '42490770', 'target-user-id': '760674363', 'tmi-sent-ts': '1647281032622' }
    ]
  }),
  'Monetization: Cheer (Tip)': (username: string) => ({
    platformEventName: 'cheer',

    platformEventData: [
      {
        'badge-info': { subscriber: '1' },
        badges: { subscriber: '0', premium: '1' },
        bits: randBetween(100, 1000),
        color: null,
        'display-name': username,
        emotes: null,
        'first-msg': false,
        flags: null,
        id: 'ff95c566-bf36-458a-a21a-75beb985f2d7',
        mod: false,
        'room-id': '42490770',
        subscriber: true,
        'tmi-sent-ts': '1647280518302',
        turbo: false,
        'user-id': '158726909',
        'user-type': null,
        'emotes-raw': null,
        'badge-info-raw': 'subscriber/1',
        'badges-raw': 'subscriber/0,premium/1',
        username: username,
        'message-type': 'chat'
      },
      'Pride100'
    ]
  }),
  'Admininistration: Message Deleted': (username: string) => ({
    platformEventName: 'messagedeleted',

    platformEventData: [
      username,
      'This is a deleted message, because I said something bad!',
      {
        login: username,
        'room-id': null,
        'target-msg-id': '23539752-9582-44d0-9286-01a31fd29b2f',
        'tmi-sent-ts': '1647280013344',
        'message-type': 'messagedeleted'
      }
    ]
  }),
  'Monetization: Resub': (username: string) => ({
    platformEventName: 'resub',

    platformEventData: [
      username,
      21,
      'Resub Poggers!',
      {
        'badge-info': { subscriber: '21' },
        badges: { subscriber: '18' },
        color: '#9ACD32',
        'display-name': username,
        emotes: null,
        flags: null,
        id: '0d61f6f7-6001-4be6-8e75-c977877819bf',
        login: username,
        mod: false,
        'msg-id': 'resub',
        'msg-param-cumulative-months': '21',
        'msg-param-months': randBetween(1, 12),
        'msg-param-multimonth-duration': false,
        'msg-param-multimonth-tenure': false,
        'msg-param-should-share-streak': true,
        'msg-param-streak-months': '21',
        'msg-param-sub-plan-name': '',
        'msg-param-sub-plan': '1000',
        'msg-param-was-gifted': 'false',
        'room-id': '207813352',
        subscriber: true,
        'system-msg':
          username + " subscribed at Tier 1. They've subscribed for 21 months, currently on a 21 month streak!",
        'tmi-sent-ts': '1647287070055',
        'user-id': '491935800',
        'user-type': null,
        'emotes-raw': null,
        'badge-info-raw': 'subscriber/21',
        'badges-raw': 'subscriber/18',
        'message-type': 'resub'
      },
      { prime: false, plan: '1000', planName: 'Woke Beys (hasanpiker): $4.99 Sub' }
    ]
  }),
  'PlatformSpecific: Slow Mode Off': (username: string) => ({
    platformEventName: 'slowmode',

    platformEventData: [false, 0]
  }),
  'PlatformSpecific: Slow Mode On': (username: string) => ({
    platformEventName: 'slowmode',

    platformEventData: [true, 20]
  }),
  'PlatformSpecific: Followers Only Off': (username: string) => ({
    platformEventName: 'followersonly',

    platformEventData: [false, 0]
  }),
  'PlatformSpecific: Followers Only On': (username: string) => ({
    platformEventName: 'followersonly',

    platformEventData: [true, 30]
  }),
  'Monetization: Sub Gift (Recieve)': (username: string) => ({
    platformEventName: 'subgift',

    platformEventData: [
      'SimulatedGiftUser',
      0,
      username,
      { prime: false, plan: '1000', planName: 'Channel Subscription (SimulatedStreamer)' },
      {
        'badge-info': { subscriber: '2' },
        badges: { subscriber: '0', 'hype-train': '1' },
        color: '#2270B2',
        'display-name': username,
        emotes: null,
        flags: null,
        id: 'b8b6293a-0814-496f-9139-2a14e7932171',
        login: username,
        mod: false,
        'msg-id': 'subgift',
        'msg-param-gift-months': true,
        'msg-param-months': 1,
        'msg-param-origin-id': 'e0 91 3f fd 3c d2 67 83 3c e9 5b f9 13 d7 96 65 45 61 83 30',
        'msg-param-recipient-display-name': username,
        'msg-param-recipient-id': '21404905',
        'msg-param-recipient-user-name': username,
        'msg-param-sender-count': false,
        'msg-param-sub-plan-name': '',
        'msg-param-sub-plan': '1000',
        'room-id': '42490770',
        subscriber: true,
        'system-msg': 'SimulatedGiftUser gifted a Tier 1 sub to Yo Mama!',
        'tmi-sent-ts': '1647278252526',
        'user-id': '151574372',
        'user-type': null,
        'emotes-raw': null,
        'badge-info-raw': 'subscriber/2',
        'badges-raw': 'subscriber/0,hype-train/1',
        'message-type': 'subgift'
      }
    ]
  }),
  'Monetization: Sub Gift (Give)': (username: string) => ({
    platformEventName: 'submysterygift',

    platformEventData: [
      username,
      5,
      { prime: false, plan: '1000', planName: null },
      {
        'badge-info': { subscriber: '7' },
        badges: { subscriber: '6', premium: '1' },
        color: null,
        'display-name': username,
        emotes: null,
        flags: null,
        id: 'ebe9bf34-760d-4be2-822c-f4e3f2cd7e20',
        login: username,
        mod: false,
        'msg-id': 'submysterygift',
        'msg-param-mass-gift-count': '5',
        'msg-param-origin-id': '06 25 64 f2 87 05 30 8a 1d d6 48 21 ea 36 d0 f4 8b 15 d4 ba',
        'msg-param-sender-count': '5',
        'msg-param-sub-plan': '1000',
        'room-id': '42490770',
        subscriber: true,
        'system-msg':
          username +
          " is gifting 5 Tier 1 Subs to SimulatedStreamer's community! They've gifted a total of 5 in the channel!",
        'tmi-sent-ts': '1647278198017',
        'user-id': '100010177',
        'user-type': null,
        'emotes-raw': null,
        'badge-info-raw': 'subscriber/7',
        'badges-raw': 'subscriber/6,premium/1',
        'message-type': 'submysterygift'
      }
    ]
  }),
  'Monetization: Subscription': (username: string) => ({
    platformEventName: 'subscription',

    platformEventData: [
      username,
      { prime: false, plan: '1000', planName: 'Channel Subscription (SimulatedStreamer)' },
      null,
      {
        'badge-info': { subscriber: '1' },
        badges: { subscriber: '0' },
        color: null,
        'display-name': username,
        emotes: null,
        flags: null,
        id: '2e3d392e-8666-4328-a2a1-a6ded5260c9e',
        login: username,
        mod: false,
        'msg-id': 'sub',
        'msg-param-cumulative-months': true,
        'msg-param-months': randBetween(1, 12),
        'msg-param-multimonth-duration': true,
        'msg-param-multimonth-tenure': false,
        'msg-param-should-share-streak': false,
        'msg-param-sub-plan-name': '',
        'msg-param-sub-plan': '1000',
        'msg-param-was-gifted': 'false',
        'room-id': '42490770',
        subscriber: true,
        'system-msg': username + ' subscribed at Tier 1.',
        'tmi-sent-ts': '1647278283372',
        'user-id': '89434087',
        'user-type': null,
        'emotes-raw': null,
        'badge-info-raw': 'subscriber/1',
        'badges-raw': 'subscriber/0',
        'message-type': 'sub'
      }
    ]
  }),
  'Administration: User Timeout': (username: string) => ({
    platformEventName: 'timeout',

    platformEventData: [
      username,
      null,
      randBetween(1, 10000),
      { 'ban-duration': '600', 'room-id': '42490770', 'target-user-id': '95184559', 'tmi-sent-ts': '1647278543056' }
    ]
  })
};

export default SimulatedEvents;

export const SelectOptions = () =>
  Object.keys(SimulatedEvents)
    .sort()
    .map(label => ({ label, value: label }));

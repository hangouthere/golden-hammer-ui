// ! FIXME : This ENTIRE file should reference the golden-hammer microservice definitions/types, and not re-defined in this project as well

export interface Platform {
  name: 'twitch'; // | 'discord' | 'youtube'; // Platform name, maps to which services to rely on
  eventName: String; // Original Event Name as it was received from the platform directly
  eventData: any; // Original Event Data as it was received from the platform directly
}

export type EventClassifications =
  | 'Administration.Ban'
  | 'Administration.MessageRemoval'
  | 'Administration.Timeout'
  | 'Administration' // ! TODO Remove this
  | 'Monetization.Subscription'
  | 'Monetization.Tip'
  | 'Monetization' // ! TODO Remove this
  | 'PlatformSpecific'
  | 'System' // ! TODO Remove this
  | 'UserChat.Message'
  | 'UserChat.Presence'
  | 'UserChat'; // ! TODO Remove this

export interface EventClassification {
  category: EventClassifications;
  subCategory: any;
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export declare namespace UserChatEventData {
  export interface EmoteMeta {
    emoteId: string;
    uri: string;
  }

  export interface MessageBuffer {
    // TODO: Consider UTF-8/etc extraction(s)?
    type: 'word' | 'emote' | 'uri';
    content: string;
    meta?: UserChatEventData.EmoteMeta;
  }
}

export interface UserChatEventClassification extends EventClassification {
  subCategory: 'Message' | 'Presence';
}

export interface UserChatEventData {
  userName: string;
  userId?: string; // Not on join/part
  messageId?: string; // Not on join/part
  roles?: string[]; // 'mod', 'sub', 'DiscordRoleName'
  messageBuffers?: UserChatEventData.MessageBuffer[];
  presence?: string | boolean; // indicates presence on a platform (ie, join|part, online|offline (as bool))
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export interface AdministrationEventClassification extends EventClassification {
  subCategory: 'Timeout' | 'Ban' | 'MessageRemoval';
}

export interface AdministrationEventData {
  userName: string; // Target userName
  roles?: string[]; // 'mod', 'sub', 'DiscordRoleName'
  removedMessage?: string; // Message that was removed
  targetId?: string; // Depends on subCategory| Timeout=userId, Ban=userId, MessageRemoval=messageId
  duration?: number; // If a duration is associated, we store it here
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export interface MonetizationEventClassification extends EventClassification {
  subCategory: 'Subscription' | 'Tip';
}

export interface MonetizationEventData {
  sourceUserName: string;
  targetUserName?: string;
  duration?: number;
  estimatedValue?: number;
  message?: string;
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export type EventClassificationTypes =
  | AdministrationEventClassification
  | MonetizationEventClassification
  | UserChatEventClassification;

export type EventDataTypes = AdministrationEventData | MonetizationEventData | UserChatEventData;

export interface NormalizedMessagingEvent {
  pubSubMsgId: string;
  timestamp: number;
  platform: Platform;
  connectTarget: string; // ChannelName, Discord URI, etc?
  eventClassification: EventClassificationTypes;
  eventData: EventDataTypes;
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export type TargetClassMap = {
  connectTarget: string;
  eventCategories: string[];
};

export type PubSubConnectionResponse = {
  registered?: boolean;
  unregistered?: boolean;
  type: 'messaging'; //TODO: Move this into the `pubsub` property
  pubsub: PubSubMessagingInfo; // TODO: This could be many other types, we only support messaing for now
};

export type PubSubMessagingInfo = TargetClassMap & {
  platformName: Platform['name'];
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// App/UI Specific

export type ConnectTargetEventMap = {
  [connectTarget: string]: NormalizedMessagingEvent[];
};

import type { UINormalizedMessagingEvent } from '-/scripts/store';
import type { AdministrationEventData } from 'golden-hammer-shared';
import React from 'react';
import type { EntryViewProps } from '../EventEntryFactory';

export default function PlatformSpecificEventEntry({ normalizedEvent }: EntryViewProps): JSX.Element | null {
  const {
    platform: { eventName, eventData }
  } = normalizedEvent as UINormalizedMessagingEvent & { eventData: AdministrationEventData };

  const enabled = eventData[0] ? 'Enabled' : 'Disabled';
  let msg;

  switch (eventName) {
    case 'clearchat':
      msg = 'Chat Cleared!';
      break;
    case 'emoteonly':
      msg = 'Emote Only Mode: ' + enabled;
      break;
    case 'subscribers':
      msg = 'Subscribes Only Mode: ' + enabled;
      break;

    case 'hosted':
      msg = 'Hosted by ' + eventData[0];
      break;
    case 'raided':
      break;
    default:
      msg = <>{JSON.stringify(eventData)}</>;
  }

  return <div className={eventName + (enabled ? 'enabled' : '')}>{msg}</div>;
}

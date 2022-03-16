import type { UINormalizedMessagingEvent } from '-/scripts/store';
import type { AdministrationEventData } from 'golden-hammer-shared';
import React from 'react';
import type { EntryViewProps } from '../EventEntryFactory';

export default function PlatformSpecificEventEntry({ normalizedEvent }: EntryViewProps): JSX.Element | null {
  const {
    platform: { eventName, eventData }
  } = normalizedEvent as UINormalizedMessagingEvent & { eventData: AdministrationEventData };

  const [isEnabled, duration] = eventData;
  const enabledTxt = isEnabled ? 'Enabled' : 'Disabled';
  let msg;

  switch (eventName) {
    case 'clearchat':
      msg = 'Chat Cleared!';
      break;
    case 'slowmode':
      msg = `Slow Mode ${enabledTxt}`;

      if (isEnabled) {
        msg = `${msg} - Chat only allowed every ${duration} seconds`;
      }
      break;
    case 'followersonly':
      msg = `Followers Only Mode ${enabledTxt}`;

      if (isEnabled) {
        msg = `${msg} - Must have followed for ${duration} minutes`;
      }
      break;
    case 'emoteonly':
      msg = `Emote Only Mode: ${enabledTxt}`;
      break;
    case 'subscribers':
      msg = `Subscribes Only Mode: ${enabledTxt}`;
      break;

    case 'hosted':
      msg = 'Hosted by ' + eventData[0];
      break;
    case 'raided':
      const [raider, numRaiding, userState] = eventData;
      const prefix = <span className="userName">{raider}:</span>;
      const profileImg = userState['msg-param-profileImageURL'];

      msg = (
        <>
          <img src={profileImg} className="profileImg" /> {prefix} has Raided with {numRaiding} viewers!
        </>
      );
      break;
    default:
      msg = <>{JSON.stringify(eventData)}</>;
  }

  return <div className={eventName + (enabledTxt ? 'enabled' : '')}>{msg}</div>;
}

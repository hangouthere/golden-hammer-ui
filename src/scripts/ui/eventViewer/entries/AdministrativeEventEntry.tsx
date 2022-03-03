import type { UINormalizedMessagingEvent } from '-/scripts/store';
import type { AdministrationEventData } from 'golden-hammer-shared';
import React from 'react';
import type { EntryViewProps } from '../panel/EventEntryFactory';

export default function AdministrativeEventEntry({ normalizedEvent }: EntryViewProps): JSX.Element | null {
  const {
    eventData: { userName, roles, removedMessage, targetId, duration },
    eventClassification: { subCategory }
  } = normalizedEvent as UINormalizedMessagingEvent & { eventData: AdministrationEventData };

  const prefix = <span className="userName">{userName}</span>;

  let action = 'Banned',
    durationMsg = 'All Time',
    msg;

  switch (subCategory) {
    case 'Timeout':
      action = 'Timed Out';
      durationMsg = `${duration} second${duration! > 1 ? 's' : ''}`;
    case 'Ban':
      msg = (
        <>
          was {action} for <span className="duration">{durationMsg}</span>
        </>
      );
      break;

    case 'MessageRemoval':
      msg = (
        <>
          <span>had a message removed.</span>
          <div className="removed-content">{removedMessage}</div>
        </>
      );
  }

  return (
    <>
      {prefix} {msg}
    </>
  );
}

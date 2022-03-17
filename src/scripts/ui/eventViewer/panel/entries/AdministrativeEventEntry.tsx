import type { UINormalizedMessagingEvent } from '-/scripts/store';
import type { AdministrationEventData } from 'golden-hammer-shared';
import React from 'react';
import type { EntryViewProps } from '../EventEntryFactory';

export default function AdministrativeEventEntry({ normalizedEvent }: EntryViewProps): JSX.Element | null {
  const {
    //!FIXME: Do some roles stuff!!!!
    eventData: { userName, roles, removedMessage, targetId, duration },
    eventClassification
  } = normalizedEvent as UINormalizedMessagingEvent & { eventData: AdministrationEventData };

  const prefix = <span className="userName">{userName}</span>;

  let action = 'Banned',
    durationMsg = 'All Time',
    msg;

  switch (eventClassification) {
    case 'Administration.Timeout':
      action = 'Timed Out';
      durationMsg = `${duration} second${duration! > 1 ? 's' : ''}`;
    case 'Administration.Ban':
      msg = (
        <>
          was {action} for <span className="duration">{durationMsg}</span>
        </>
      );
      break;

    case 'Administration.MessageRemoval':
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

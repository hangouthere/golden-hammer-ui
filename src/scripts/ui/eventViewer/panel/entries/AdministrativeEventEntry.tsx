import type { UINormalizedMessagingEvent } from '-/scripts/store/types.js';
import type { AdministrationEventData } from 'golden-hammer-shared';
import type { EntryViewProps } from '../EventEntryFactory.js';

export default function AdministrativeEventEntry({ normalizedEvent }: EntryViewProps): JSX.Element | null {
  const {
    //!FIXME: Do some roles stuff!!!!
    eventData: { userName, removedMessage, duration },
    eventClassification
  } = normalizedEvent as UINormalizedMessagingEvent & { eventData: AdministrationEventData };

  const prefix = <span className="userName">{userName}</span>;

  let durationMsg = 'All Time',
    msg;

  const banTimeoutEntry = (action: string, durationMsg: string) => (
    <>
      was {action} for <span className="duration">{durationMsg}</span>
    </>
  );

  switch (eventClassification) {
    case 'Administration.Timeout':
      durationMsg = `${duration} second${(duration as number) > 1 ? 's' : ''}`;
      msg = banTimeoutEntry('Timed Out', durationMsg);
      break;
    case 'Administration.Ban':
      msg = banTimeoutEntry('Banned', durationMsg);
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

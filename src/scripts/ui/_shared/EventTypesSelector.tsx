import { Chip, Chips } from '@mantine/core';
import { useEffect, useState } from 'react';
import type { EventClassifications } from 'golden-hammer-shared';
import { GHPubSub_EventTypes } from '-/scripts/store/index.js';

type Props = {
  selectedEvents: EventClassifications;
  onChange: (value: EventClassifications) => void;
};

export default function EventTypesSelector({ onChange, selectedEvents }: Props) {
  const [_selectedEvents, setSelectedEvents] = useState(selectedEvents as unknown as string[]);

  const manageChanges = (values: string[]) => {
    setSelectedEvents(values);
    onChange(values as EventClassifications);
  };

  useEffect(() => {
    setSelectedEvents(selectedEvents);
  }, [selectedEvents]);

  return (
    <Chips multiple value={_selectedEvents} onChange={manageChanges} direction="column">
      {GHPubSub_EventTypes.map(et => (
        <Chip key={et} value={et}>
          {et}
        </Chip>
      ))}
    </Chips>
  );
}

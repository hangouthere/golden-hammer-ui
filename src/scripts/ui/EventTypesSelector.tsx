import { Chip, Chips } from '@mantine/core';
import React, { useEffect, useState } from 'react';

export const GHPubSub_EventTypes = ['UserChat', 'Monetization', 'Administration', 'System', 'PlatformSpecific'];

type Props = {
  selectedEvents: string[];
  onChange: (value: string[]) => void;
};

export default function EventTypesSelector({ onChange, selectedEvents }: Props) {
  const [_selectedEvents, setSelectedEvents] = useState(selectedEvents);

  const manageChanges = values => {
    setSelectedEvents(values);

    onChange(values);
  };

  useEffect(() => {
    setSelectedEvents(selectedEvents);
  }, [selectedEvents]);

  return (
    <Chips multiple value={_selectedEvents} onChange={manageChanges}>
      {GHPubSub_EventTypes.map(et => (
        <Chip key={et} value={et}>
          {et}
        </Chip>
      ))}
    </Chips>
  );
}

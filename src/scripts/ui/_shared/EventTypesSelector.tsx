import { GHPubSub_EventTypes } from '-/scripts/store';
import { Chip, Chips } from '@mantine/core';
import React, { useEffect, useState } from 'react';

type Props = {
  selectedEvents: string[];
  onChange: (value: string[]) => void;
};

export default function EventTypesSelector({ onChange, selectedEvents }: Props) {
  const [_selectedEvents, setSelectedEvents] = useState(selectedEvents);

  const manageChanges = (values: string[]) => {
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

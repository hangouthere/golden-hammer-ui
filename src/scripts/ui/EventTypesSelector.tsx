import { Chip, Chips } from '@mantine/core';
import React from 'react';

export const GHPubSub_EventTypes = ['UserChat', 'Monetization', 'Administration', 'System', 'PlatformSpecific'];

type Props = {
  selectedEvents: string[];
  onChange: (value: string[]) => void;
};

export default function EventTypesSelector({ onChange, selectedEvents }: Props) {
  return (
    <Chips multiple value={selectedEvents} onChange={onChange}>
      {GHPubSub_EventTypes.map(et => (
        <Chip key={et} value={et}>
          {et}
        </Chip>
      ))}
    </Chips>
  );
}

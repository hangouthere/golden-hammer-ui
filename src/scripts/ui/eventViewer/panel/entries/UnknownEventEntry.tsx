import type { UINormalizedMessagingEvent } from '-/scripts/store';
import { Group, Text, Title } from '@mantine/core';
import React from 'react';
import type { EntryViewProps } from '../EventEntryFactory';

export default function UnknownEventEntry({ normalizedEvent }: EntryViewProps): JSX.Element | null {
  const { eventData, eventClassification } = normalizedEvent as UINormalizedMessagingEvent;

  return (
    <Group direction="column">
      <Group>
        <Title order={3}>Unknown Event: </Title>
        <Text>{JSON.stringify(eventClassification)}</Text>
      </Group>

      <Group direction="column">
        <Title order={3}>Event Data: </Title>
        <Text>{JSON.stringify(eventData)}</Text>
      </Group>
    </Group>
  );
}

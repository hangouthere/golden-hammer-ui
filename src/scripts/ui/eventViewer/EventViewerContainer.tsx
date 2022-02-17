import useStore from '-/store';
import { StyledEventViewer } from '-/styles/eventViewer';
import { Group, Title } from '@mantine/core';
import React, { useMemo } from 'react';
import { EventEntryPanel } from './panel/EventEntryPanel';

const NoPubSubsDetected = () => (
  <Group grow className="remind-add">
    <Title order={2}>Please add a PubSub Registration</Title>
  </Group>
);

export default function EventViewerContainer() {
  const { connectedTargetMaps } = useStore(s => s);

  const {
    classes: { Container }
  } = StyledEventViewer();

  const connectTargets = useMemo(() => [...connectedTargetMaps.keys()], [connectedTargetMaps]) || [];
  const numTargets = connectTargets.length;

  const chosenView = 0 === numTargets ? <NoPubSubsDetected /> : <EventEntryPanel />;

  return (
    <Group grow className={Container} direction="column">
      {chosenView}
    </Group>
  );
}

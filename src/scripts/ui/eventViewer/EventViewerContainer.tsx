import useStore from '-/store';
import { StyledEventViewer } from '-/styles/eventViewer';
import { Group, Title, useMantineTheme } from '@mantine/core';
import React, { useMemo } from 'react';
import { EventEntryPanel } from './panel/EventEntryPanel';

const NoPubSubsDetected = () => {
  const colors = useMantineTheme().other.Platforms.default;
  const {
    classes: { Reminder }
  } = StyledEventViewer(colors);

  return (
    <Group grow className={Reminder}>
      <Title order={2}>Please add a PubSub Registration</Title>
    </Group>
  );
};

export default function EventViewerContainer() {
  const { connectedPubSubs } = useStore(s => s);

  const connectTargets = useMemo(() => [...connectedPubSubs.keys()], [connectedPubSubs]) || [];
  const numTargets = connectTargets.length;

  return 0 === numTargets ? <NoPubSubsDetected /> : <EventEntryPanel />;
}

import useStore, { IStore } from '-/store';
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

const getState = (s: IStore) => ({ connectedPubSubs: s.connectedPubSubs, activePubSub: s.activePubSub });

export default function EventViewerContainer() {
  const { connectedPubSubs, activePubSub } = useStore(
    getState,
    (p, n) => p.connectedPubSubs.size === n.connectedPubSubs.size
  );

  const connectTargets = useMemo(() => [...connectedPubSubs.keys()], [connectedPubSubs]) || [];
  const numTargets = connectTargets.length;

  return !activePubSub || 0 === numTargets ? <NoPubSubsDetected /> : <EventEntryPanel />;
}

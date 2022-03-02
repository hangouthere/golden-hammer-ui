import useStore, { type IStore } from '-/scripts/store';
import { StyledEventViewer } from '-/scripts/styles/eventViewer';
import { Group, Title, useMantineTheme } from '@mantine/core';
import React, { useMemo } from 'react';
import { EventEntryPanel } from './panel/EventEntryPanel';

type NoPubSubsDetectedProps = {
  hasConnectTargets: boolean;
};

const NoPubSubsDetected = ({ hasConnectTargets }: NoPubSubsDetectedProps) => {
  const colors = useMantineTheme().other.Platforms.default;
  const {
    classes: { Reminder }
  } = StyledEventViewer(colors);

  const msg = hasConnectTargets
    ? 'Please select a PubSub Registration on the Left'
    : 'Please add a PubSub Registration';

  return (
    <Group grow className={Reminder}>
      <Title order={2}>{msg}</Title>
    </Group>
  );
};

const getState = (s: IStore) => ({ connectedPubSubs: s.connectedPubSubs, activePubSub: s.activePubSub });

export default function EventViewerContainer() {
  const { connectedPubSubs, activePubSub } = useStore(
    getState,
    (p, n) => p.activePubSub === n.activePubSub && p.connectedPubSubs.size === n.connectedPubSubs.size
  );

  const connectTargets = useMemo(() => [...connectedPubSubs.keys()], [connectedPubSubs]) || [];
  const numTargets = connectTargets.length;

  return !activePubSub || 0 === numTargets ? (
    <NoPubSubsDetected hasConnectTargets={!!connectedPubSubs.size} />
  ) : (
    <EventEntryPanel />
  );
}

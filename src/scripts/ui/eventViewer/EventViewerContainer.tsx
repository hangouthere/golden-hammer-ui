import { Group, Title, useMantineTheme } from '@mantine/core';
import { useMemo } from 'react';
import { StyledEventViewer } from '-/scripts/styles/eventViewer.js';
import { EventEntryPanel } from './panel/EventEntryPanel.js';
import useStore, { type IStore } from '-/scripts/store/index.js';

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

const getState = (s: IStore) => ({ connectedPubSubs: s.connectedTargets, activePubSub: s.activeConnectedTarget });

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

import { SocketStatus } from '-/scripts/store/InitState.js';
import useStore, { type IStore } from '-/scripts/store/index.js';
import { StyledNavBar } from '-/scripts/styles/navbar.js';
import { Group, Navbar, type NavbarProps } from '@mantine/core';
import type { ConnectTargetClassificationsAssociation, PubSubConnectionResponse } from 'golden-hammer-shared';
import React, { useMemo } from 'react';
import shallow from 'zustand/shallow';
import SimulatorModal from '../EventSimulator/SimulatorModal.js';
import ConnectedTargetNavItem from './ConnectedTargetNavItem.js';
import InfoModal from './InfoModal.js';
import NoConnectedTargetsNavItem from './NoConnectedTargetsNavItem.js';
import PubSubConfig from './PubSubConfig.js';
import PubSubRegisterPanel from './PubSubRegisterPanel.js';

type Props = Omit<NavbarProps, 'children'>;

const getStateVals = (s: IStore) => ({
  activePubSub: s.activeConnectedTarget,
  autoConnect: s.autoConnect,
  connectedPubSubs: s.connectedTargets,
  connectionStatus: s.connectionStatus,
  pubsubRegisterChat: s.pubsubRegisterChat,
  pubsubUnregisterChat: s.pubsubUnregisterChat,
  setActivePubSub: s.setActivePubSub
});

function NavBar(props: Props) {
  const {
    activePubSub,
    connectedPubSubs,
    connectionStatus,
    pubsubRegisterChat,
    pubsubUnregisterChat,
    setActivePubSub
  } = useStore(getStateVals, shallow);

  const hasTargetMaps = !!connectedPubSubs.size;
  const isConnected = SocketStatus.Connected === connectionStatus;

  const isActive = (conn: PubSubConnectionResponse) => activePubSub?.pubsub.connectTarget === conn.pubsub.connectTarget;

  const noTargetsView = <NoConnectedTargetsNavItem isConnected={isConnected} />;

  const pubSubNavItems = useMemo(
    () =>
      [...connectedPubSubs.values()].map(pubSubConn => (
        <ConnectedTargetNavItem
          key={pubSubConn.pubsub.connectTarget}
          hasUpdates={!!pubSubConn.hasUpdates}
          reSubEventClassifications={pubsubRegisterChat}
          unregisterPubSub={pubsubUnregisterChat}
          onClick={() => setActivePubSub(pubSubConn)}
          className={isActive(pubSubConn) ? 'active' : ''}
          connectTargetClassificationsAssociation={pubSubConn.pubsub as ConnectTargetClassificationsAssociation}
        />
      )),
    [connectedPubSubs, activePubSub]
  );

  const {
    classes: { NavBarContainer, ScrollAreaContainer }
  } = StyledNavBar();

  return (
    <Navbar {...props} className={NavBarContainer}>
      <Navbar.Section>
        <Group position="right">
          <PubSubConfig />
          <SimulatorModal />
          <InfoModal />
        </Group>
      </Navbar.Section>

      <Navbar.Section grow className={ScrollAreaContainer}>
        {hasTargetMaps ? pubSubNavItems : noTargetsView}
      </Navbar.Section>

      <Navbar.Section>
        <PubSubRegisterPanel disabled={!isConnected} pubSubRegister={pubsubRegisterChat} />
      </Navbar.Section>
    </Navbar>
  );
}

export default React.memo(NavBar);

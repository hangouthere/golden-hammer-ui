import { Accordion, AccordionItem, Navbar, type NavbarProps } from '@mantine/core';
import type { PubSubConnectionResponse } from 'golden-hammer-shared';
import React, { useMemo } from 'react';
import shallow from 'zustand/shallow';
import useStore, { type IStore } from '../store';
import { SocketStatus } from '../store/InitState';
import { StyledNavBar } from '../styles/navbar';
import ConnectedTargetNavItem from './navbar/ConnectedTargetNavItem';
import { ConnectionStatusLabel, ConnectStatusForm } from './navbar/ConnectStatusAccordionItem';
import NoConnectedTargetsNavItem from './navbar/NoConnectedTargetsNavItem';
import PubSubRegisterPanel from './navbar/PubSubRegisterPanel';

interface Props extends Omit<NavbarProps, 'children'> {}

const getStateVals = (s: IStore) => ({
  activePubSub: s.activePubSub,
  autoConnect: s.autoConnect,
  connectedPubSubs: s.connectedPubSubs,
  connectionStatus: s.connectionStatus,
  pubsubRegisterChat: s.pubsubRegisterChat,
  pubsubUnregisterChat: s.pubsubUnregisterChat,
  setActivePubSub: s.setActivePubSub
});

function NavBar(props: Props) {
  const {
    activePubSub,
    autoConnect,
    connectedPubSubs,
    connectionStatus,
    pubsubRegisterChat,
    pubsubUnregisterChat,
    setActivePubSub
  } = useStore(getStateVals, shallow);

  const chosenInitialAccordionItem = !autoConnect ? 0 : -1;
  const hasTargetMaps = !!connectedPubSubs.size;
  const isConnected = SocketStatus.Connected === connectionStatus;
  const isActive = (conn: PubSubConnectionResponse) => activePubSub?.pubsub.connectTarget === conn.pubsub.connectTarget;

  const noTargetsView = <NoConnectedTargetsNavItem isConnected={isConnected} />;

  const pubSubNavItems = useMemo(
    () =>
      [...connectedPubSubs.values()].map(pubSubConn => (
        <ConnectedTargetNavItem
          key={pubSubConn.pubsub.connectTarget}
          targetClassMap={pubSubConn.pubsub}
          reSubEventCategories={pubsubRegisterChat}
          unregisterPubSub={pubsubUnregisterChat}
          onClick={() => setActivePubSub(pubSubConn)}
          className={isActive(pubSubConn) ? 'active' : ''}
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
        <Accordion initialItem={chosenInitialAccordionItem}>
          <AccordionItem label={<ConnectionStatusLabel connectionStatus={connectionStatus} />}>
            <ConnectStatusForm />
          </AccordionItem>
        </Accordion>
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

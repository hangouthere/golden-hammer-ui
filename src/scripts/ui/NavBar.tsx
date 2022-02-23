import useStore, { IStore } from '-/store';
import { SocketStatus } from '-/store/InitState';
import { StyledNavBar } from '-/styles/navbar';
import { Accordion, AccordionItem, Navbar, NavbarProps, ScrollArea } from '@mantine/core';
import { TargetClassMap } from 'golden-hammer-shared';
import React, { useCallback, useMemo } from 'react';
import shallow from 'zustand/shallow';
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
  const isActive = conn => activePubSub?.pubsub.connectTarget === conn.pubsub.connectTarget;

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
          className={isActive(pubSubConn) ? 'active' : null}
        />
      )),
    [connectedPubSubs, activePubSub]
  );

  const {
    classes: { NavBarContainer, ScrollAreaContainer }
  } = StyledNavBar();

  const onAddPubSubRegister = useCallback(
    (targetClassMap: TargetClassMap) => {
      pubsubRegisterChat(targetClassMap);
    },
    [pubsubRegisterChat]
  );

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
        <ScrollArea>{hasTargetMaps ? pubSubNavItems : noTargetsView}</ScrollArea>
      </Navbar.Section>

      <Navbar.Section>
        <PubSubRegisterPanel disabled={!isConnected} pubSubRegister={onAddPubSubRegister} />
      </Navbar.Section>
    </Navbar>
  );
}

export default React.memo(NavBar);

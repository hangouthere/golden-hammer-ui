import useStore from '-/store';
import { SocketStatus } from '-/store/InitState';
import { TargetClassMap } from '-/store/PubSubMessaging';
import { StyledNavBar } from '-/styles/navbar';
import { Accordion, AccordionItem, Group, Navbar, NavbarProps, ScrollArea, useCss } from '@mantine/core';
import React from 'react';
import ConnectedTargetNavItem from './navbar/ConnectedTargetNavItem';
import { ConnectionStatusLabel, ConnectStatusForm } from './navbar/ConnectStatusAccordionItem';
import NoConnectedTargetsNavItem from './navbar/NoConnectedTargetsNavItem';
import PubSubRegisterPanel from './navbar/PubSubRegisterPanel';

interface Props extends Omit<NavbarProps, 'children'> {}

export default function NavBar(props: Props) {
  const { cx } = useCss();
  const {
    autoConnect,
    connectionStatus,
    pubsubRegisterChat,
    pubsubUnregisterChat,
    connectedPubSubs,
    activePubSub,
    setActivePubSub
  } = useStore(s => s);

  const chosenInitialAccordionItem = !autoConnect ? 0 : -1;
  const hasTargetMaps = !!connectedPubSubs.size;
  const isConnected = SocketStatus.Connected === connectionStatus;

  const noTargetsView = <NoConnectedTargetsNavItem isConnected={isConnected} />;

  const pubSubNavItems = [...connectedPubSubs.values()].map(pubSubConn => (
    <ConnectedTargetNavItem
      key={pubSubConn.pubsub.connectTarget}
      targetClassMap={pubSubConn.pubsub}
      reSubEventCategories={pubsubRegisterChat}
      unregisterPubSub={pubsubUnregisterChat}
      onClick={() => setActivePubSub(pubSubConn)}
      className={cx({ active: activePubSub?.pubsub.connectTarget === pubSubConn.pubsub.connectTarget })}
    />
  ));

  const {
    classes: { NavBarContainer, ScrollAreaContainer }
  } = StyledNavBar();

  const onAddPubSubRegister = (targetClassMap: TargetClassMap) => {
    pubsubRegisterChat(targetClassMap);
  };

  return (
    <Navbar {...props} className={NavBarContainer}>
      <Navbar.Section>
        <Accordion initialItem={chosenInitialAccordionItem}>
          <AccordionItem label={<ConnectionStatusLabel connectionStatus={connectionStatus} />}>
            <ConnectStatusForm />
          </AccordionItem>
        </Accordion>
      </Navbar.Section>

      <Navbar.Section grow className={ScrollAreaContainer} component={hasTargetMaps ? ScrollArea : Group}>
        {hasTargetMaps ? pubSubNavItems : noTargetsView}
      </Navbar.Section>

      <Navbar.Section>
        <PubSubRegisterPanel disabled={!isConnected} pubSubRegister={onAddPubSubRegister} />
      </Navbar.Section>
    </Navbar>
  );
}

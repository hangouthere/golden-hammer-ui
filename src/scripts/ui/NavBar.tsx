import useStore, { TargetClassMap } from '-/store';
import { SocketStatus } from '-/store/InitState';
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
    connectedTargetMaps,
    activeTargetClassMap,
    setActiveTargetClassMap
  } = useStore(s => s);

  const chosenInitialAccordionItem = !autoConnect ? 0 : -1;
  const hasTargetMaps = !!connectedTargetMaps.size;
  const isConnected = SocketStatus.Connected === connectionStatus;

  const noTargetsView = <NoConnectedTargetsNavItem isConnected={isConnected} />;

  const selectConnectTarget = (targetClassMap: TargetClassMap) => {
    setActiveTargetClassMap(targetClassMap);
  };

  const connectedTargetViews = [...connectedTargetMaps.values()].map(cT => (
    <ConnectedTargetNavItem
      key={cT.connectTarget}
      targetClassMap={cT}
      reSubEventCategories={pubsubRegisterChat}
      unregisterPubSub={pubsubUnregisterChat}
      onClick={() => selectConnectTarget(cT)}
      className={cx({ active: activeTargetClassMap?.connectTarget === cT.connectTarget })}
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
        {hasTargetMaps ? connectedTargetViews : noTargetsView}
      </Navbar.Section>

      <Navbar.Section>
        <PubSubRegisterPanel disabled={!isConnected} pubSubRegister={onAddPubSubRegister} />
      </Navbar.Section>
    </Navbar>
  );
}

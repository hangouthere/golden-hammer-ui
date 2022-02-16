import useStore from '-/store';
import { SocketStatus } from '-/store/InitState';
import { StyledNavBar } from '-/styles/navbar';
import { Accordion, AccordionItem, Group, Navbar, NavbarProps, ScrollArea } from '@mantine/core';
import React from 'react';
import ConnectedTargetNavItem from './navbar/ConnectedTargetNavItem';
import { ConnectionStatusLabel, ConnectStatusForm } from './navbar/ConnectStatusAccordionItem';
import NoConnectedTargetsNavItem from './navbar/NoConnectedTargetsNavItem';
import PubSubRegisterPanel from './navbar/PubSubRegisterPanel';

interface Props extends Omit<NavbarProps, 'children'> {}

export default function NavBar(props: Props) {
  const { autoConnect, connectionStatus, pubsubRegisterChat, connectedTargetMaps } = useStore(s => s);

  const chosenInitialAccordionItem = !autoConnect ? 0 : -1;
  const hasTargetMaps = !!connectedTargetMaps.size;

  const connectedTargetViews = hasTargetMaps
    ? [...connectedTargetMaps.values()].map(cT => (
        <ConnectedTargetNavItem key={cT.connectTarget} targetClassMap={cT} reSubEventCategories={pubsubRegisterChat} />
      ))
    : null;

  const {
    classes: { NavBarContainer, ScrollAreaContainer }
  } = StyledNavBar();

  const isConnected = SocketStatus.Connected === connectionStatus;

  const noTargetsView = <NoConnectedTargetsNavItem isConnected={isConnected} />;

  return (
    <Navbar {...props} className={NavBarContainer}>
      <Navbar.Section>
        <Accordion initialItem={chosenInitialAccordionItem}>
          <AccordionItem label={<ConnectionStatusLabel connectionStatus={connectionStatus} />}>
            <ConnectStatusForm />
          </AccordionItem>
        </Accordion>
      </Navbar.Section>

      <Navbar.Section grow className={ScrollAreaContainer} component={!connectedTargetViews ? Group : ScrollArea}>
        {connectedTargetViews || noTargetsView}
      </Navbar.Section>

      <Navbar.Section>
        <PubSubRegisterPanel pubSubRegister={pubsubRegisterChat} />
      </Navbar.Section>
    </Navbar>
  );
}

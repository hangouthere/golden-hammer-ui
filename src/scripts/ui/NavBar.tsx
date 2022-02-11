import useStore from '-/store';
import { Accordion, AccordionItem, Navbar, NavbarProps } from '@mantine/core';
import React from 'react';
import { ConnectionStatusLabel, ConnectStatusForm } from './navbar/ConnectStatusAccordionItem';
import PubSubRegisterPanel from './navbar/PubSubRegisterPanel';

interface Props extends Omit<NavbarProps, 'children'> {}

export default function index(props: Props) {
  const { autoConnect, connectionStatus } = useStore(s => s);

  const chosenInitialAccordionItem = !autoConnect ? 0 : -1;

  return (
    <Navbar {...props}>
      <Navbar.Section grow>
        <Accordion initialItem={chosenInitialAccordionItem}>
          <AccordionItem label={<ConnectionStatusLabel connectionStatus={connectionStatus} />}>
            <ConnectStatusForm />
          </AccordionItem>
        </Accordion>
      </Navbar.Section>

      <Navbar.Section>
        <PubSubRegisterPanel />
      </Navbar.Section>
    </Navbar>
  );
}

import { AppShell } from '@mantine/core';
import React, { ReactElement, useEffect } from 'react';
import useStore from './store';
import Header from './ui/Header';
import Navbar from './ui/NavBar';

//! FIXME HACK CRAP GET RID OF IT!
let u = new URLSearchParams(globalThis.location.search);
const isDevMode = null !== u.get('dev');

export default function App(): ReactElement {
  const { connect, autoConnect, pubSubUri } = useStore(s => s);

  // Only autoconnect on startup!
  useEffect(() => {
    if (autoConnect) {
      connect(pubSubUri);
    }
  }, []);

  return (
    <AppShell
      padding="md"
      navbar={<Navbar width={{ base: 400 }} padding="md" />}
      header={<Header height={75} padding="sm" />}
      styles={theme => ({
        main: { backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0] }
      })}
    >
      Join a Channel
    </AppShell>
  );
}

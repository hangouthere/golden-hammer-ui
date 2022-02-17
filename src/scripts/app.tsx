import { AppShell } from '@mantine/core';
import React, { ReactElement, useEffect } from 'react';
import useStore from './store';
import { GHPubSub_EventTypes } from './ui/_shared/EventTypesSelector';
import EventViewerContainer from './ui/eventViewer/EventViewerContainer';
import Header from './ui/Header';
import Navbar from './ui/NavBar';

//! FIXME HACK CRAP GET RID OF IT!
let u = new URLSearchParams(globalThis.location.search);
const isDevMode = null !== u.get('dev');

export default function App(): ReactElement {
  const { connect, autoConnect, pubSubUri, pubsubRegisterChat } = useStore(s => s);

  // Only autoconnect on startup!
  useEffect(() => {
    if (autoConnect) {
      connect(pubSubUri);
      // !FIXME GET RID OF THIS!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
      // !FIXME GET RID OF THIS!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
      // !FIXME GET RID OF THIS!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
      // !FIXME GET RID OF THIS!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

      const tgtClassMap = { connectTarget: 'nfgcodex', eventCategories: [...GHPubSub_EventTypes] };

      pubsubRegisterChat(tgtClassMap);
    }
  }, []);

  return (
    <AppShell
      padding="md"
      navbar={<Navbar width={{ base: 400 }} padding="md" />}
      header={<Header height={75} padding="sm" />}
    >
      <EventViewerContainer />
    </AppShell>
  );
}

import { AppShell } from '@mantine/core';
import React, { useEffect, type ReactElement } from 'react';
import shallow from 'zustand/shallow';
import useStore, { GHPubSub_EventTypes, type IStore } from './store';
import EventViewerContainer from './ui/eventViewer/EventViewerContainer';
import Header from './ui/Header';
import Navbar from './ui/navbar';

//! FIXME HACK CRAP GET RID OF IT!
let u = new URLSearchParams(globalThis.location.search);
const isDevMode = null !== u.get('dev');
const connectTargets = u.getAll('connectTargets') || [];

const getState = (s: IStore) => ({
  connect: s.connect,
  autoConnect: s.autoConnect,
  pubSubUri: s.pubSubUri,
  pubsubRegisterChat: s.pubsubRegisterChat
});

export default function App(): ReactElement {
  const { connect, autoConnect, pubSubUri, pubsubRegisterChat } = useStore(getState, shallow);

  // Only autoconnect on startup!
  useEffect(() => {
    if (autoConnect) {
      connect(pubSubUri);

      connectTargets.forEach(connectTarget =>
        pubsubRegisterChat({ connectTarget, eventCategories: [...GHPubSub_EventTypes] })
      );
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

import { MantineProvider } from '@mantine/core';
import { NotificationsProvider } from '@mantine/notifications';
import React from 'react';
import { render } from 'react-dom';
import App from './app';
import EventerNotificationProvider from './EventerNotificationProvider';
import { StylesConfig, ThemeConfig } from './MantineProviderConfig';

render(
  <MantineProvider
    withGlobalStyles
    withNormalizeCSS
    // ! Theme Definitions
    theme={ThemeConfig}
    // ! Global Style Overrides!
    styles={StylesConfig}
  >
    <NotificationsProvider>
      <EventerNotificationProvider>
        <App />
      </EventerNotificationProvider>
    </NotificationsProvider>
  </MantineProvider>,
  document.getElementById('root')
);

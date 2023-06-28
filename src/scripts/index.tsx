import { MantineProvider } from '@mantine/core';
import { NotificationsProvider } from '@mantine/notifications';
import { render } from 'react-dom';
import EventerNotificationProvider from './EventerNotificationProvider.js';
import { ThemeConfig, StylesConfig } from './MantineProviderConfig.js';
import App from './app.js';

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

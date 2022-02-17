import { MantineProvider } from '@mantine/core';
import React from 'react';
import { render } from 'react-dom';
import App from './app';
import { ButtonProps } from './styles/buttons';

render(
  <MantineProvider
    withGlobalStyles
    withNormalizeCSS
    // ! Theme Definitions
    theme={{
      colorScheme: 'dark',
      primaryColor: 'cyan',

      // Use the `other` namespace to define theme objects to pass to `createStyles` stylesheets
      other: {
        CautionButton: {
          colorBG: '#770622',
          colorFG: '#FFF'
        } as ButtonProps
      }
    }}
    // ! Global Style Overrides!
    styles={{
      AppShell: theme => ({
        main: { backgroundColor: theme.colors.dark[8], padding: 0 }
      }),

      Popover: _theme => ({
        body: {
          '.mantine-Divider-horizontal': {
            width: '100%'
          }
        }
      }),

      Tooltip: theme => ({
        body: {
          color: theme.fn.themeColor('dark', 0),
          backgroundColor: theme.fn.themeColor('dark', 4),
          boxShadow: `${theme.fn.themeColor('dark', 9)} 0 0 5px`,

          '.mantine-Divider-horizontal': {
            width: '100%'
          }
        },
        arrow: {
          backgroundColor: theme.fn.themeColor('dark', 4)
        }
      })
    }}
  >
    <App />
  </MantineProvider>,
  document.getElementById('root')
);

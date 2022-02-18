import { MantineProvider } from '@mantine/core';
import React from 'react';
import { render } from 'react-dom';
import App from './app';
import { ButtonProps } from './styles/buttons';
import { StyledEventViewerProps } from './styles/eventViewer';

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
        } as ButtonProps,

        Platforms: {
          default: {
            colorBG: '#333',
            colorFG: '#FFF',
            colorUserName: '#F00',
            colorBorder: {
              normal: '#FF00FF',
              inner: {
                action: '#F00',
                monetized: '#FF0'
              }
            }
          } as StyledEventViewerProps,

          twitch: {
            colorBG: '#0f0816',
            colorFG: '#FFF',
            colorUserName: '#ca7ff9',
            colorBorder: {
              normal: '#29075c',
              inner: {
                action: 'rgb(79 53 118)',
                monetized: 'rgb(255, 208, 0)'
              }
            }
          } as StyledEventViewerProps
        }
      }
    }}
    // ! Global Style Overrides!
    styles={{
      AppShell: theme => ({
        root: {
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          width: '100%'
        },
        main: {
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          backgroundColor: theme.colors.dark[8],
          padding: 0
        },
        body: {
          overflow: 'hidden'
        }
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

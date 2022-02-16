import { MantineProvider } from '@mantine/core';
import React from 'react';
import { render } from 'react-dom';
import App from './app';
import { ButtonProps } from './styles/buttons';

render(
  <MantineProvider
    withGlobalStyles
    withNormalizeCSS
    theme={{
      colorScheme: 'dark',
      primaryColor: 'cyan',

      other: {
        CautionButton: {
          colorBG: '#770622',
          colorFG: '#FFF'
        } as ButtonProps
      }
    }}
    styles={{
      Tooltip: theme => ({
        body: {
          color: theme.fn.themeColor('dark', 0),
          backgroundColor: theme.fn.themeColor('dark', 4),
          boxShadow: `${theme.fn.themeColor('dark', 9)} 0 0 5px`
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

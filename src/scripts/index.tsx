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
  >
    <App />
  </MantineProvider>,
  document.getElementById('root')
);

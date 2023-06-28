import { createStyles } from '@mantine/core';

export const StyledNavBar = createStyles(_theme => ({
  NavBarContainer: {
    '.remind-container': {
      flex: 1,
      height: '100%'
    },
    '.remind-sub': {
      flex: 0
    }
  },

  ScrollAreaContainer: {
    overflow: 'auto',
    marginTop: '8px',
    height: '100%'
  },

  PubSubRegisterPanel: {
    '.mantine-Accordion-content': {
      maxHeight: '200px',
      overflow: 'auto'
    }
  }
}));

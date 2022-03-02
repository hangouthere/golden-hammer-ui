import { createStyles } from '@mantine/core';

export const StyledNavBar = createStyles(theme => ({
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
    marginTop: '8px',
    height: '100%'
  }
}));

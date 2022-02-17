import { createStyles } from '@mantine/core';

export const StyledEventViewer = createStyles(theme => ({
  Container: {
    flex: 1,
    height: '100%',

    '.remind-add': {
      textAlign: 'center',
      width: '100%',
      height: '100%'
    }
  },

  PanelHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: '10px',

    '.options': {
      justifyContent: 'right',
      flex: 1
    }
  },

  PanelList: {
    flexDirection: 'column-reverse'
  }
}));

import { createStyles } from '@mantine/core';

export const StyledMisc = createStyles(_theme => ({
  Compact: {
    '.mantine-UnstyledButton-root': {
      padding: '5px',
      marginTop: '5px'
    }
  },

  InfoModal: {
    '.mantine-Text-root.mantine-Anchor-root': {
      lineHeight: '1.55px'
    },

    '.whoami': {
      marginLeft: '-10px',
      color: '#FF8A3B',
      textShadow: '0 0 4px #FF8A3B'
    }
  },

  SimulatorModalRoot: {
    pointerEvents: 'none'
  },

  SimulatorModal: {
    pointerEvents: 'all',
    border: '1px solid rgba(255, 255, 0, 0.4)',
    left: '50%',
    transform: 'translateX(-50%)',
    boxShadow: 'rgb(255 255 0 / 40%) 0px 0px 10px'
  }
}));

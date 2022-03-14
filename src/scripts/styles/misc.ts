import { createStyles } from '@mantine/core';

export const StyledMisc = createStyles(theme => ({
  Compact: {
    '.mantine-UnstyledButton-root': {
      padding: '5px',
      marginTop: '5px'
    }
  },

  InfoModal: {
    '.mantine-Text-root.mantine-Anchor-root': {
      lineHeight: '1.55px'
    }
  },

  SimulatorModalRoot: {
    pointerEvents: 'none'
  },

  SimulatorModal: {
    pointerEvents: 'all',
    border: '1px solid yellow',
    left: '50%',
    transform: 'translateX(-50%)',
    boxShadow: 'rgb(255 255 0 / 40%) 0px 0px 10px,rgb(255 255 0 / 40%) 0px 0px 10px,rgb(255 255 0 / 40%) 0px 0px 10px'
  }
}));

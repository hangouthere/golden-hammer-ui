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
  }
}));

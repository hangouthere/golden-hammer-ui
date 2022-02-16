import { createStyles } from '@mantine/core';

export const StyledInputs = createStyles(theme => ({
  SimpleTextInputWithButton: {
    width: '100%',
    display: 'flex',
    alignItems: 'end',

    '.mantine-TextInput-root': {
      flex: 1
    },

    [`
      .mantine-ActionIcon-root,
      .mantine-Button-root
    `]: {
      marginBottom: '2px'
    },

    '.mantine-Tooltip-root': {
      width: '100%'
    }
  }
}));

import { createStyles } from '@mantine/core';

export interface StyledEventViewerProps {
  colorBG: string;
  colorFG: string;
  colorUserName: string;
  colorBorder: ColorBorder;
}

export interface ColorBorder {
  normal: string;
  inner: Inner;
}

export interface Inner {
  action: string;
  monetized: string;
}

export const StyledEventViewer = createStyles((theme, colors: StyledEventViewerProps) => {
  return {
    Reminder: {
      top: '50%',
      alignSelf: 'center',
      transform: 'translate(0, -50%)',
      position: 'absolute'
    },

    PanelHeader: {
      display: 'flex',
      alignItems: 'center',
      padding: '10px',
      background: theme.fn.darken(theme.colors[theme.primaryColor][9], 0.2),

      '& > .mantine-Group-root': {
        width: '100%',
        flex: 1
      },

      '.options': {
        justifyContent: 'right',
        flex: 1
      },

      '.statsThumb': {
        position: 'relative',
        width: '100%',
        border: '1px solid #AAA',
        top: '-8px',

        '&:before': {
          content: '"\\23F7"',
          position: 'absolute',
          width: '40px',
          borderBottom: '#EEE',
          top: '-6px',
          textAlign: 'center',
          border: '2px solid #333',
          lineHeight: '18px',
          background: '#ccc',
          color: '#333',
          left: '50%',
          transform: 'translate(-50%)'
        },

        '.stats-container': {
          padding: '3px',
          fontSize: '70%'
        }
      }
    },

    PanelScrollArea: {
      height: '100%',
      overflowY: 'auto'
    },

    EventLogEntry: {
      fontSize: '18px',
      verticalAlign: 'middle',
      padding: '5px',
      marginBottom: '6px',
      paddingRight: '20px',
      maxHeight: '500px',
      transition: 'all 1s',

      border: '1px solid #29075c',
      borderLeft: '10px solid #29075c',
      backgroundColor: '#0f0816',

      a: {
        color: '#3baac3',
        textDecoration: 'none',

        '&:hover': {
          color: '#bbc349',
          textDecoration: 'underline'
        }
      },

      'img.emote': {
        width: '24px'
      },

      '.userName': {
        color: '#ca7ff9'
      }
    },

    'UserChat-Message': {
      transition: 'all 250ms',

      '&:hover': {
        fontSize: '125%'
      }
    },

    'UserChat-Presence': {
      fontSize: '10px',
      borderLeft: '4px solid #29075c',
      filter: 'opacity(0.5)',
      transition: 'all 250ms',

      '&:hover': {
        filter: 'opacity(1)',
        fontSize: '18px'
      }
    }
  };
});

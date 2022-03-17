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

// !FIXME - Need to utilize colors for actual theming!!!

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

      a: {
        color: '#e4ff00',
        fontWeight: 'normal'
      },

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
          fontSize: '70%',
          // Same props as sibling div (for the case of NOT using transition)
          display: 'flex',
          justifyContent: 'space-between',
          paddingLeft: '8px',
          paddingRight: '8px',
          flex: 1,

          '.label': {
            fontWeight: 'bold',
            fontSize: '110%'
          },

          '& > div': {
            // Same props as .stats-container (for the case of using transition)
            display: 'flex',
            justifyContent: 'space-between',
            flex: 1
          }
        }
      }
    },

    PanelScrollContainer: {
      height: '100%',

      '.BaseTable__body': {
        scrollBehavior: 'smooth'
      }
    },

    FrozenEventsOverlay: {
      position: 'absolute',
      top: '20px',
      left: '50%',
      zIndex: 1,
      padding: '5px 8px',
      minWidth: '170px',

      boxShadow: `0 0 11px ${theme.colors[theme.primaryColor][4]}88`
    },

    EventLogEntry: {
      position: 'relative',
      fontSize: '18px',
      verticalAlign: 'middle',
      padding: '5px',
      marginBottom: '6px',
      paddingRight: '20px',
      maxHeight: '500px',
      transition: 'all 1s',
      overflow: 'hidden',

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

      'img.profileImg': {
        width: '48px'
      },

      '.userName': {
        color: 'rgb(203, 128, 249)'
      },

      '.removed-content': {
        transition: 'all 250ms',
        filter: 'blur(5px)',
        fontSize: '10px',

        '&:hover': {
          filter: 'blur(0)',
          fontSize: '110%'
        }
      }
    },

    'UserChat-Message': {
      transition: 'all 250ms',

      '&:hover': {
        fontSize: '125%',

        '.removed-content': {
          filter: 'blur(0)',
          fontSize: '110%'
        }
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
    },

    Administration: {
      fontSize: '10px',

      '.duration': {
        fontSize: '110%',
        textShadow: '0 0 8px rgb(155, 40, 40), 0 0 8px rgb(155, 40, 40)'
      },

      '&:before': {
        content: "' '",
        border: '1px solid rgb(155, 40, 40)',
        boxShadow: 'inset 0 0 26px rgb(155, 40, 40 / 40%)',
        position: 'absolute',
        top: '0',
        bottom: '0',
        left: '0',
        right: '0'
      }
    },

    Monetization: {
      textAlign: 'center',

      '.duration': {
        fontSize: '120%',
        color: '#00d0ff',
        textShadow: '0 0 6px #00d0ff'
      },

      '.estimatedValue': {
        fontSize: '110%',
        textShadow: '0 0 8px #00ff2f, 0 0 8px #00ff2f'
      },

      '&:before': {
        content: "' '",
        border: '1px solid rgb(255, 208, 0)',
        boxShadow: 'inset 0 0 26px rgb(255 208 0 / 40%)',
        position: 'absolute',
        top: '0',
        bottom: '0',
        left: '0',
        right: '0'
      }
    },

    PlatformSpecific: {
      textAlign: 'center',
      textShadow: `0 0 1px #000,
                   0 0 1px #000,
                   0 0 1px #000,
                   0 0 1px #000,
                   0 0 1px #000,
                   0 0 1px #000`,

      '&:before': {
        content: "' '",
        border: '1px solid rgb(203, 128, 249)',
        boxShadow: `inset 0 0 26px rgb(203 128 249 / 40%),
                    inset 0 0 26px rgb(203 128 249 / 40%),
                    inset 0 0 26px rgb(203 128 249 / 40%),
                    inset 0 0 26px rgb(203 128 249 / 40%)`,
        position: 'absolute',
        top: '0',
        bottom: '0',
        left: '0',
        right: '0'
      }
    },

    'twitch-action': {
      padding: '8px',
      paddingLeft: '12px',

      '&:before': {
        content: "' '",
        border: '2px solid rgb(203, 128, 249)',
        position: 'absolute',
        top: '0',
        bottom: '0',
        left: '0',
        right: '0'
      }
    }
  };
});

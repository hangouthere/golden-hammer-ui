import { ButtonVariant, createStyles, getSharedColorScheme, MantineColor } from '@mantine/core';

export interface ButtonProps {
  colorFG?: MantineColor;
  colorBG?: MantineColor;
  variant?: ButtonVariant;
  colorVariance?: number;
}

export const StyledButton = createStyles(
  (theme, { colorVariance = 0.3, variant = 'subtle', ...colors }: ButtonProps) => {
    const colorScheme = getSharedColorScheme({
      theme,
      color: colors.colorFG,
      variant
    });

    return {
      SimpleRollOver: {
        color: colors.colorFG ? colors.colorFG : '',
        backgroundColor: colors.colorBG ? colors.colorBG : '',
        '&:hover': {
          colorFG: colors.colorFG ? theme.fn.darken(colors.colorFG, colorVariance) : '',
          backgroundColor: colors.colorBG ? theme.fn.lighten(colors.colorBG, colorVariance) : ''
        }
      },

      ButtonInButton: {
        display: 'flex',
        padding: '5px',
        paddingLeft: '8px',
        marginBottom: '4px',

        '&.active': {
          backgroundColor: colorScheme.hover
        }
      }
    };
  }
);

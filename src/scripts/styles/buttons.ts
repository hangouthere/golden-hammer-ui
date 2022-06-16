import { createStyles, type ButtonVariant, type MantineColor } from '@mantine/core';

import { useMantineDefaultProps } from '@mantine/styles';

export interface ButtonProps {
  colorFG?: MantineColor;
  colorBG?: MantineColor;
  variant?: ButtonVariant;
  colorVariance?: number;
}

export const StyledButton = createStyles(
  (theme, { colorVariance = 0.3, variant = 'subtle', ...colors }: ButtonProps) => {
    const { color: defaultColor } = useMantineDefaultProps('Button', {}, { color: colors.colorFG });
    const colorVariant = theme.fn.variant({ color: colors.colorFG || defaultColor, variant });

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
          backgroundColor: colorVariant.hover
        }
      }
    };
  }
);

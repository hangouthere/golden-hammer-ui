import { createStyles, MantineColor } from '@mantine/core';

export interface ButtonProps {
  colorFG?: MantineColor;
  colorBG?: MantineColor;
  colorVariance?: number;
}

export const StyledButton = createStyles((theme, { colorVariance = 0.3, ...colors }: ButtonProps) => {
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
      paddingLeft: '8px'
    }
  };
});

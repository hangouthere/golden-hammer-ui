import { createStyles, MantineColor } from '@mantine/core';

export interface ButtonProps {
  colorFG: MantineColor;
  colorBG: MantineColor;
  colorVariance: number;
}

export const StyledButton = createStyles((theme, { colorVariance = 0.3, ...colors }: ButtonProps) => ({
  SimpleRollOver: {
    color: colors.colorFG,
    backgroundColor: colors.colorBG,
    '&:hover': {
      colorFG: theme.fn.darken(colors.colorFG, colorVariance),
      backgroundColor: theme.fn.lighten(colors.colorBG, colorVariance)
    }
  }
}));

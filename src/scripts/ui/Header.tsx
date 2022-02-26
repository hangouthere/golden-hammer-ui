import { Group, Header as MHeader, Image, Title, type HeaderProps } from '@mantine/core';
import React from 'react';

const ImageLogo = new URL('../../assets/logo.png', import.meta.url);

export default function Header(props: Omit<HeaderProps, 'children'>) {
  return (
    <MHeader {...props}>
      <Group>
        <Image src={ImageLogo.href} width={48} />

        <Group align="baseline">
          <Title order={1}>Project: Golden Hammer</Title>
          <Title order={6}>by nfgCodex!</Title>
        </Group>
      </Group>
    </MHeader>
  );
}

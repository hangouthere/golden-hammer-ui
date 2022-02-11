import { Group, Header, HeaderProps, Image, Title } from '@mantine/core';
import React from 'react';

const ImageLogo = new URL('../../assets/logo.png', import.meta.url);

export default function index(props: Omit<HeaderProps, 'children'>) {
  return (
    <Header {...props}>
      <Group>
        <Image src={ImageLogo.href} width={48} />

        <Group align="baseline">
          <Title order={1}>Project: Golden Hammer</Title>
          <Title order={6}>by nfgCodex!</Title>
        </Group>
      </Group>
    </Header>
  );
}

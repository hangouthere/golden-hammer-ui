import { Group, Image, Space } from '@mantine/core';
import React from 'react';

const ImageConnect = new URL('../../../assets/navConnect.png', import.meta.url);
const ImageSub = new URL('../../../assets/navSub.png', import.meta.url);

type Props = { isConnected: boolean };

export default function NoConnectedTargetsNavItem({ isConnected }: Props) {
  return (
    <Group direction="column" align="center" grow className="remind-container">
      {!isConnected && <Image width={200} className="remind-connect" src={ImageConnect.href} />}

      <Space />

      <Image width={200} className="remind-sub" src={ImageSub.href} />
    </Group>
  );
}

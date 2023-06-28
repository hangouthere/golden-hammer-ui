import ImageConnect from '-/assets/navConnect.png';
import ImageSub from '-/assets/navSub.png';
import { Group, Image, Space } from '@mantine/core';

type Props = { isConnected: boolean };

export default function NoConnectedTargetsNavItem({ isConnected }: Props) {
  return (
    <Group direction="column" align="center" grow className="remind-container">
      {!isConnected && <Image width={200} className="remind-connect" src={ImageConnect} />}

      <Space />

      <Image width={200} className="remind-sub" src={ImageSub} />
    </Group>
  );
}

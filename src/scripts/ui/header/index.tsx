import ImageLogo from '-/assets/logo.png';
import { Group, Header as MHeader, Image, Title, type HeaderProps } from '@mantine/core';

export default function Header(props: Omit<HeaderProps, 'children'>) {
  return (
    <MHeader {...props}>
      <Group>
        <Image src={ImageLogo} width={48} />

        <Group align="baseline">
          <Title order={1}>Golden Hammer Event Viewer</Title>
        </Group>
      </Group>
    </MHeader>
  );
}

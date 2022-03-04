import ImageLogo from '-/assets/logo.png';
import {
  ActionIcon,
  Anchor,
  Group,
  Header as MHeader,
  Image,
  Modal,
  Space,
  Title,
  Tooltip,
  type HeaderProps
} from '@mantine/core';
import React, { useState } from 'react';
import { BsDiscord } from 'react-icons/bs';
import { IoInformation, IoLogoBitbucket } from 'react-icons/io5';
import { StyledMisc } from '../styles/misc';

export default function Header(props: Omit<HeaderProps, 'children'>) {
  const [showInfo, setShowInfo] = useState(false);

  const {
    classes: { InfoModal }
  } = StyledMisc();

  return (
    <MHeader {...props}>
      <Group>
        <Image src={ImageLogo} width={48} />

        <Group align="baseline">
          <Title order={1}>Golden Hammer Event Viewer</Title>
          <Title order={6}>by nfgCodex!</Title>
        </Group>

        <Space sx={{ flex: 1 }} />

        <ActionIcon radius="xl" variant="filled">
          <IoInformation onClick={() => setShowInfo(true)} />
        </ActionIcon>
      </Group>

      <Modal centered opened={showInfo} onClose={() => setShowInfo(false)} title="Project: Golden Hammer">
        <Group grow direction="column" className={InfoModal}>
          <Group position="center">
            <Image src={ImageLogo} width={128} />
          </Group>

          <>
            <Title order={4}>What this project is:</Title>
            This project is a re-imagining of the vanillajs demonstration provided with the Golden Hammer Microservices!
            <br />
            <br />
            It is meant to be a demonstration of how to register and operate on PubSub functionality within Golden
            Hammer, as well as demonstrate the integration of a framework like React (and the optimizations required to
            keep it performant).
            <Space />
            <Title order={4}>What this project is NOT:</Title>
            This project is NOT meant to be a full-fledged chat or administration application.
          </>

          <Space h="xl" sx={{ flex: 1 }} />

          <Group position="right">
            <Tooltip label="UI Source">
              <ActionIcon variant="filled" radius="xl">
                <Anchor target="_blank" href="https://bitbucket.org/nerdfoundrygaming/golden-hammer-ui/src/">
                  <IoLogoBitbucket />
                </Anchor>
              </ActionIcon>
            </Tooltip>

            <Tooltip label="Microservices Source">
              <ActionIcon variant="filled" radius="xl">
                <Anchor target="_blank" href="https://bitbucket.org/nerdfoundrygaming/golden-hammer-services/src/">
                  <IoLogoBitbucket />
                </Anchor>
              </ActionIcon>
            </Tooltip>

            <Tooltip label="Join our Discord!">
              <ActionIcon variant="filled" radius="xl">
                <Anchor target="_blank" href="https://url.nfgarmy.com/discord">
                  <BsDiscord />
                </Anchor>
              </ActionIcon>
            </Tooltip>
          </Group>
        </Group>
      </Modal>
    </MHeader>
  );
}

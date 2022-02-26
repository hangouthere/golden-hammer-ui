import useStore, { type IStore } from '-/scripts/store';
import { SocketStatus } from '-/scripts/store/InitState';
import { StyledButton } from '-/scripts/styles/buttons';
import { StyledInputs } from '-/scripts/styles/inputs';
import { Button, Checkbox, ColorSwatch, Group, Space, TextInput, Title, Tooltip, useMantineTheme } from '@mantine/core';
import { useBooleanToggle, useForm } from '@mantine/hooks';
import React, { type ChangeEvent } from 'react';
import shallow from 'zustand/shallow';

type ConnectionStatusProps = {
  connectionStatus: SocketStatus;
};

export const ConnectionStatusLabel = ({ connectionStatus }: ConnectionStatusProps) => {
  const isConnected = SocketStatus.Connected === connectionStatus;
  const isConnecting = SocketStatus.Connecting === connectionStatus;
  const connectColor = isConnected ? 'cyan' : isConnecting ? 'yellow' : 'red';

  return (
    <Group position="apart">
      <Title order={6}>Connection</Title>

      <ColorSwatch radius="xl" size={16} color={connectColor}></ColorSwatch>
    </Group>
  );
};

const getState = (s: IStore) => ({
  autoConnect: s.autoConnect,
  connect: s.connect,
  disconnect: s.disconnect,
  pubSubUri: s.pubSubUri,
  setAutoConnect: s.setAutoConnect,
  connectionStatus: s.connectionStatus
});

export const ConnectStatusForm = () => {
  const theme = useMantineTheme();
  const [showWarnConnect, setShowWarnConnect] = useBooleanToggle(false);

  const { autoConnect, connect, disconnect, pubSubUri, setAutoConnect, connectionStatus } = useStore(getState, shallow);

  const isConnected = connectionStatus === SocketStatus.Connected;
  const _connect = () => {
    const values = ghPubSubConnectForm.values;
    connect(values.pubSubUri);
  };

  const {
    classes: { SimpleRollOver }
  } = StyledButton(theme.other.CautionButton);

  const {
    classes: { SimpleTextInputWithButton }
  } = StyledInputs();

  const toggleAutoConnect = (event: ChangeEvent<HTMLInputElement>) => {
    setAutoConnect(event.target.checked);
  };

  const ghPubSubConnectForm = useForm({
    initialValues: {
      pubSubUri
    }
  });

  const checkWarnConnect = (event: React.MouseEvent) => {
    if (event.type === 'mouseout') {
      return setShowWarnConnect(false);
    }

    setShowWarnConnect(isConnected);
  };

  return (
    <>
      <form className={SimpleTextInputWithButton}>
        <Tooltip withArrow label="Disconnect to edit PubSub URI" opened={showWarnConnect}>
          <TextInput
            style={{ flex: 1 }}
            placeholder="Enter GH PubSub URI"
            label="GH PubSub URI"
            description="Endpoint for GH PubSub"
            size="xs"
            disabled={isConnected}
            onMouseOver={checkWarnConnect}
            onMouseOut={checkWarnConnect}
            {...ghPubSubConnectForm.getInputProps('pubSubUri')}
          />
        </Tooltip>
      </form>

      <Space h="sm" />

      <Checkbox label="AutoConnect?" checked={autoConnect} onChange={toggleAutoConnect} size="xs" />

      <Space h="md" />

      <Group position="right" spacing="sm" noWrap>
        <Button compact onClick={disconnect} className={SimpleRollOver} disabled={!isConnected}>
          Disconnect
        </Button>
        <Button compact onClick={_connect} disabled={isConnected}>
          Connect
        </Button>
      </Group>
    </>
  );
};

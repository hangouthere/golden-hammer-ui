import useStore from '-/store';
import { SocketStatus } from '-/store/InitState';
import { StyledButton } from '-/styles/buttons';
import { StyledInputs } from '-/styles/inputs';
import { Button, Checkbox, ColorSwatch, Group, Space, TextInput, Title, Tooltip, useMantineTheme } from '@mantine/core';
import { useBooleanToggle, useForm } from '@mantine/hooks';
import React, { ChangeEvent } from 'react';

export const ConnectionStatusLabel = ({ connectionStatus }) => {
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

export const ConnectStatusForm = () => {
  const theme = useMantineTheme();
  const [showWarnConnect, setShowWarnConnect] = useBooleanToggle(false);

  const { autoConnect, connect, disconnect, pubSubUri, setAutoConnect, connectionStatus } = useStore(s => s);

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

  const checkWarnConnect = event => {
    if (event.type === 'mouseout') {
      return setShowWarnConnect(false);
    }

    setShowWarnConnect(isConnected);
  };

  return (
    <>
      <form className={SimpleTextInputWithButton}>
        <Tooltip withArrow label="Disconnect to edit PubSub URI" opened={showWarnConnect} withinPortal={false}>
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

import useStore from '-/store';
import { SocketStatus } from '-/store/InitState';
import { StyledButton } from '-/styles/buttons';
import { StyledInputs } from '-/styles/inputs';
import {
  ActionIcon,
  Button,
  Checkbox,
  ColorSwatch,
  Group,
  Space,
  TextInput,
  Title,
  Tooltip,
  useMantineTheme
} from '@mantine/core';
import { useBooleanToggle, useForm } from '@mantine/hooks';
import React, { ChangeEvent, useEffect } from 'react';
import { MdDirtyLens } from 'react-icons/md';
import { RiSaveLine } from 'react-icons/ri';

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
  const [isDirty, setIsDirty] = useBooleanToggle(false);
  const [showWarnConnect, setShowWarnConnect] = useBooleanToggle(false);

  const { autoConnect, connect, disconnect, pubSubUri, setAutoConnect, updatePubSubUri, connectionStatus } = useStore(
    s => s
  );

  const isConnected = connectionStatus === SocketStatus.Connected;
  const onFormSubmit = v => updatePubSubUri(v.pubSubUri);

  const {
    classes: { SimpleRollOver }
  } = StyledButton(theme.other.CautionButton);

  const {
    classes: { SimpleTextInputWithButton }
  } = StyledInputs();

  const checkDirty = _e => {
    const isDirty = pubSubUri !== ghPubSubConnectForm.values.pubSubUri;

    setIsDirty(isDirty);
  };

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

  useEffect(() => checkDirty(null), [pubSubUri]);

  return (
    <>
      <form
        className={SimpleTextInputWithButton}
        onKeyUp={checkDirty}
        onSubmit={ghPubSubConnectForm.onSubmit(onFormSubmit)}
      >
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

        <Space w="sm" />

        <ActionIcon disabled={isConnected} type="submit">
          {isDirty && <MdDirtyLens />}
          {!isDirty && <RiSaveLine />}
        </ActionIcon>
      </form>

      <Space h="sm" />

      <Checkbox label="AutoConnect?" checked={autoConnect} onChange={toggleAutoConnect} size="xs" />

      <Space h="md" />

      <Group position="right" spacing="sm" noWrap>
        <Button compact onClick={disconnect} className={SimpleRollOver} disabled={!isConnected}>
          Disconnect
        </Button>
        <Button compact onClick={connect} disabled={isConnected}>
          Connect
        </Button>
      </Group>
    </>
  );
};

import useStore, { type IStore } from '-/scripts/store/index.js';
import { SocketStatus } from '-/scripts/store/InitState.js';
import { StyledButton } from '-/scripts/styles/buttons.js';
import { ActionIcon, Button, Checkbox, Group, Input, Popover, Space, Tooltip, useMantineTheme } from '@mantine/core';
import { useBooleanToggle, useInputState } from '@mantine/hooks';
import React, { useCallback, useEffect, useState, type ChangeEvent } from 'react';
import { HiCog } from 'react-icons/hi';
import shallow from 'zustand/shallow';

const getState = (s: IStore) => ({
  autoConnect: s.autoConnect,
  connect: s.connect,
  disconnect: s.disconnect,
  pubSubUri: s.pubSubUri,
  setAutoConnect: s.setAutoConnect,
  connectionStatus: s.connectionStatus
});

export default function PubSubConfig() {
  const { autoConnect, connect, disconnect, pubSubUri, setAutoConnect, connectionStatus } = useStore(getState, shallow);
  const theme = useMantineTheme();
  const [showModal, setShowModal] = useState(!autoConnect);
  const [inputVal, setInputVal] = useInputState(pubSubUri);
  const [showWarnConnect, setShowWarnConnect] = useBooleanToggle(false);

  const isConnecting = SocketStatus.Connecting === connectionStatus;
  const isConnected = connectionStatus === SocketStatus.Connected;

  const connectColor = isConnected ? 'cyan' : isConnecting ? 'yellow' : 'red';

  const toggleAutoConnect = (event: ChangeEvent<HTMLInputElement>) => {
    setAutoConnect(event.target.checked);
  };

  const {
    classes: { SimpleRollOver }
  } = StyledButton(theme.other.CautionButton);

  const checkWarnConnect = useCallback(
    (event: React.MouseEvent) => {
      if (event.type === 'mouseout') {
        return setShowWarnConnect(false);
      }

      setShowWarnConnect(isConnected);
    },
    [setShowWarnConnect, isConnected]
  );

  const checkSubmit = useCallback((event: React.KeyboardEvent) => {
    if ('Enter' === event.key) {
      _connect();
    }
  }, []);

  const _connect = useCallback(() => connect(inputVal), [inputVal]);
  useEffect(() => setInputVal(pubSubUri), [pubSubUri]);

  return (
    <>
      <Popover
        opened={showModal}
        onClose={() => setShowModal(false)}
        title="PubSub Endpoint Config"
        position="bottom"
        withArrow
        arrowSize={4}
        width={250}
        target={
          <Tooltip withArrow label="Configure PubSub" position="bottom">
            <ActionIcon variant="filled" color={connectColor} onClick={() => setShowModal(true)}>
              <HiCog />
            </ActionIcon>
          </Tooltip>
        }
      >
        <Tooltip withArrow label="Disconnect to edit PubSub URI" opened={showWarnConnect}>
          <Input
            style={{ flex: 1 }}
            value={inputVal}
            onChange={setInputVal}
            placeholder="Enter GH PubSub URI"
            variant="filled"
            disabled={isConnected}
            onMouseOver={checkWarnConnect}
            onMouseOut={checkWarnConnect}
            onKeyUp={checkSubmit}
          />
        </Tooltip>

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
      </Popover>
    </>
  );
}

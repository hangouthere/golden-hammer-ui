import { TargetClassMap } from '-/store/PubSubMessaging';
import { StyledButton } from '-/styles/buttons';
import { ActionIcon, Button, Group, GroupProps, Popover, Title, useMantineTheme } from '@mantine/core';
import useButtonStyles from '@mantine/core/esm/components/Button/Button.styles';
import { useBooleanToggle } from '@mantine/hooks';
import React from 'react';
import { MdLeakAdd } from 'react-icons/md';
import EventTypesSelector from '../_shared/EventTypesSelector';

const ConnectTargetEventSelector = ({
  eventCategories,
  onChangeEventCategories,
  SimpleRollOverClassName,
  unregisterPubSub
}) => (
  <Group m={3} direction="column" grow>
    <EventTypesSelector selectedEvents={eventCategories} onChange={onChangeEventCategories} />

    <Group position="right">
      <Button radius="xl" size="xs" className={SimpleRollOverClassName} onClick={unregisterPubSub}>
        Unregister
      </Button>
    </Group>
  </Group>
);

type Props = Omit<GroupProps, 'children'> & {
  targetClassMap: TargetClassMap;
  reSubEventCategories: (targetClassMap: TargetClassMap) => void;
  unregisterPubSub: (connectTarget: string) => void;
  //hasUpdates: boolean;
};

export default function ConnectedTargetNavItem({
  targetClassMap: { connectTarget, eventCategories },
  reSubEventCategories,
  unregisterPubSub,
  ...restProps
}: Props) {
  const theme = useMantineTheme();
  const [showConfig, setShowConfig] = useBooleanToggle(false);

  const toggleConfig = () => setShowConfig(!showConfig);

  const onChangeEventCategories = _eventCategories =>
    reSubEventCategories({ connectTarget, eventCategories: _eventCategories });

  const {
    classes: { root, subtle },
    cx
  } = useButtonStyles({ radius: 'md' }, { classNames: {}, styles: {}, name: 'ButtonInButton' });

  const {
    classes: { ButtonInButton, SimpleRollOver }
  } = StyledButton(theme.other.CautionButton);

  const onUnregisterPubSub = () => {
    unregisterPubSub(connectTarget);
  };

  return (
    <Group
      position="apart"
      spacing="lg"
      className={cx(restProps.className, root, subtle, ButtonInButton)}
      onClick={restProps.onClick}
    >
      <Title order={5}>{connectTarget}</Title>

      <Popover
        withArrow
        arrowSize={4}
        opened={showConfig}
        width={200}
        position="right"
        placement="start"
        onClose={() => setShowConfig(false)}
        target={
          <ActionIcon onClick={toggleConfig}>
            <MdLeakAdd />
          </ActionIcon>
        }
      >
        <ConnectTargetEventSelector
          onChangeEventCategories={onChangeEventCategories}
          SimpleRollOverClassName={SimpleRollOver}
          eventCategories={eventCategories}
          unregisterPubSub={onUnregisterPubSub}
        />
      </Popover>
    </Group>
  );
}

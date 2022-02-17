import { TargetClassMap } from '-/store';
import { StyledButton } from '-/styles/buttons';
import { ActionIcon, Button, Group, GroupProps, Title, Tooltip, useMantineTheme } from '@mantine/core';
import useButtonStyles from '@mantine/core/esm/components/Button/Button.styles';
import { useBooleanToggle, useClickOutside } from '@mantine/hooks';
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
  reSubEventCategories: (TargetClassMap) => void;
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
  const toolTipRef = useClickOutside(() => setShowConfig(false));

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

      <Tooltip
        withArrow
        tooltipRef={toolTipRef}
        allowPointerEvents={true}
        arrowSize={4}
        position="right"
        width={200}
        opened={showConfig}
        label={
          <ConnectTargetEventSelector
            onChangeEventCategories={onChangeEventCategories}
            SimpleRollOverClassName={SimpleRollOver}
            eventCategories={eventCategories}
            unregisterPubSub={onUnregisterPubSub}
          />
        }
      >
        <ActionIcon onClick={toggleConfig}>
          <MdLeakAdd />
        </ActionIcon>
      </Tooltip>
    </Group>
  );
}

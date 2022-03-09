import { StyledButton } from '-/scripts/styles/buttons';
import { ActionIcon, Button, Group, Popover, Title, useMantineTheme, type GroupProps } from '@mantine/core';
// @ts-ignore-next-line
import useButtonStyles from '@mantine/core/esm/components/Button/Button.styles';
import { useBooleanToggle } from '@mantine/hooks';
import type { TargetClassMap } from 'golden-hammer-shared';
import React from 'react';
import { MdLeakAdd } from 'react-icons/md';
import EventTypesSelector from '../_shared/EventTypesSelector';

type EventCategories = string[];

type EventSelectorProps = {
  eventCategories: EventCategories;
  onChangeEventCategories: (types: EventCategories) => void;
  SimpleRollOverClassName: string;
  unregisterPubSub: () => void;
};

const ConnectTargetEventSelector = ({
  eventCategories,
  onChangeEventCategories,
  SimpleRollOverClassName,
  unregisterPubSub
}: EventSelectorProps) => (
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
  //FIXME: Show updates when events change?
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

  const onChangeEventCategories = (eventCategories: EventCategories) =>
    reSubEventCategories({ connectTarget, eventCategories });

  const {
    classes: { root, default: defaultStyle },
    cx
  } = useButtonStyles(
    {
      radius: 'md',
      color: 'red',
      size: 'md',
      fullWidth: false,
      compact: false,
      gradientFrom: '',
      gradientTo: '',
      gradientDeg: 0
    },
    { classNames: {}, styles: {}, name: 'ButtonInButton' }
  );

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
      className={cx(restProps.className, root, defaultStyle, ButtonInButton)}
      onClick={restProps.onClick}
    >
      <Title order={5}>{connectTarget}</Title>

      <Popover
        withArrow
        arrowSize={4}
        opened={showConfig}
        position="right"
        placement="start"
        onClose={() => setShowConfig(false)}
        target={
          <ActionIcon onClick={toggleConfig} variant="filled">
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

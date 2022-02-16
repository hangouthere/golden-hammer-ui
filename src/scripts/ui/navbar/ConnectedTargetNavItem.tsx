import { TargetClassMap } from '-/store';
import { StyledButton } from '-/styles/buttons';
import { ActionIcon, Box, Group, GroupProps, Title, Tooltip } from '@mantine/core';
import useButtonStyles from '@mantine/core/esm/components/Button/Button.styles';
import { useBooleanToggle, useClickOutside } from '@mantine/hooks';
import React from 'react';
import { BsFilter } from 'react-icons/bs';
import EventTypesSelector from '../EventTypesSelector';

type Props = Omit<GroupProps, 'children'> & {
  targetClassMap: TargetClassMap;
  reSubEventCategories: (TargetClassMap) => void;
  //hasUpdates: boolean;
};

export default function ConnectedTargetNavItem({
  targetClassMap: { connectTarget, eventCategories },
  reSubEventCategories,
  ...restProps
}: Props) {
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
    classes: { ButtonInButton }
  } = StyledButton({});

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
          <Box m={3}>
            <EventTypesSelector selectedEvents={eventCategories} onChange={onChangeEventCategories} />
          </Box>
        }
      >
        <ActionIcon onClick={toggleConfig}>
          <BsFilter />
        </ActionIcon>
      </Tooltip>
    </Group>
  );
}

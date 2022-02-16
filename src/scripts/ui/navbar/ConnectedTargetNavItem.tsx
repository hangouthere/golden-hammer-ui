import { TargetClassMap } from '-/store';
import { StyledButton } from '-/styles/buttons';
import { ActionIcon, Group, Title, Tooltip } from '@mantine/core';
import useButtonStyles from '@mantine/core/esm/components/Button/Button.styles';
import { useBooleanToggle, useClickOutside } from '@mantine/hooks';
import React from 'react';
import { BsFilter } from 'react-icons/bs';
import EventTypesSelector from '../EventTypesSelector';

type Props = {
  targetClassMap: TargetClassMap;
  reSubEventCategories: (TargetClassMap) => void;
  //hasUpdates: boolean;
};

export default function ConnectedTargetNavItem({
  targetClassMap: { connectTarget, eventCategories },
  reSubEventCategories
}: Props) {
  const [showConfig, setShowConfig] = useBooleanToggle(false);
  const toolTipRef = useClickOutside(() => setShowConfig(false));

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
    <Group position="apart" spacing="lg" className={cx(root, subtle, ButtonInButton)}>
      <Title order={5}>{connectTarget}</Title>

      <Tooltip
        tooltipRef={toolTipRef}
        allowPointerEvents={true}
        color="dark"
        position="right"
        withArrow
        width={200}
        opened={showConfig}
        label={<EventTypesSelector selectedEvents={eventCategories} onChange={onChangeEventCategories} />}
      >
        <ActionIcon onClick={() => setShowConfig(!showConfig)}>
          <BsFilter />
        </ActionIcon>
      </Tooltip>
    </Group>
  );
}

import useStore from '-/store';
import { StyledEventViewer } from '-/styles/eventViewer';
import EventTypesSelector from '-/ui/_shared/EventTypesSelector';
import { ActionIcon, Box, Divider, Group, Header, Popover, Title, Tooltip } from '@mantine/core';
import { useBooleanToggle } from '@mantine/hooks';
import React from 'react';
import { BsFilter } from 'react-icons/bs';
import { MdLeakAdd, MdLeakRemove } from 'react-icons/md';

const ConnectTargetEventSelector = ({ eventCategories, onChangeEventCategories, titleLabel }) => (
  <Group m={3} direction="column" spacing="xs">
    <Box>{titleLabel}:</Box>
    <Divider />
    <EventTypesSelector selectedEvents={eventCategories} onChange={onChangeEventCategories} />
  </Group>
);

export const EntryHeader = ({ desiredEventTypes, setDesiredEventTypes }) => {
  const { activeTargetClassMap, pubsubRegisterChat, pubsubUnregisterChat } = useStore(s => s);

  const [showPubSubTooltip, setShowPubSubTooltip] = useBooleanToggle(false);
  const [showDesiredFilterTooltip, setShowDesiredFilterTooltip] = useBooleanToggle(false);
  const toggleToolTip_pubsub = () => setShowPubSubTooltip(!showPubSubTooltip);
  const toggleToolTip_desired = () => setShowDesiredFilterTooltip(!showDesiredFilterTooltip);

  const onPubSubChange = _eventCategories => pubsubRegisterChat({ connectTarget, eventCategories: _eventCategories });

  const { connectTarget } = activeTargetClassMap;

  const {
    classes: { PanelHeader }
  } = StyledEventViewer();

  return (
    <Header height={56} className={PanelHeader}>
      <Title order={4}>{activeTargetClassMap.connectTarget}</Title>

      <Group className="options">
        <Popover
          opened={showDesiredFilterTooltip}
          onClose={() => setShowDesiredFilterTooltip(false)}
          withArrow
          withinPortal={false}
          arrowSize={4}
          position="bottom"
          placement="end"
          width={250}
          target={
            <ActionIcon onClick={toggleToolTip_desired} variant="filled">
              <BsFilter />
            </ActionIcon>
          }
        >
          <ConnectTargetEventSelector
            titleLabel="Filter which Events to See"
            onChangeEventCategories={setDesiredEventTypes}
            eventCategories={desiredEventTypes}
          />
        </Popover>

        <Popover
          opened={showPubSubTooltip}
          onClose={() => setShowPubSubTooltip(false)}
          withArrow
          withinPortal={false}
          arrowSize={4}
          position="bottom"
          placement="end"
          width={250}
          target={
            <ActionIcon onClick={toggleToolTip_pubsub} variant="filled">
              <MdLeakAdd />
            </ActionIcon>
          }
        >
          <ConnectTargetEventSelector
            titleLabel="Modify which Events to Subscribe to"
            onChangeEventCategories={onPubSubChange}
            eventCategories={activeTargetClassMap.eventCategories}
          />
        </Popover>

        <Tooltip withArrow arrowSize={4} position="left" label="Unregister" withinPortal={false}>
          <ActionIcon variant="filled" color="red">
            <MdLeakRemove />
          </ActionIcon>
        </Tooltip>
      </Group>
    </Header>
  );
};

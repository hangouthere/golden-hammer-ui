import useStore from '-/store';
import { StyledEventViewer } from '-/styles/eventViewer';
import EventTypesSelector from '-/ui/_shared/EventTypesSelector';
import { ActionIcon, Box, Collapse, Divider, Group, Popover, Title, Tooltip, useMantineTheme } from '@mantine/core';
import { useBooleanToggle } from '@mantine/hooks';
import React, { useCallback } from 'react';
import { BsFilter } from 'react-icons/bs';
import { MdLeakAdd, MdLeakRemove } from 'react-icons/md';

const ConnectTargetEventSelector = ({ eventCategories, onChangeEventCategories, titleLabel }) => (
  <Group m={3} direction="column" spacing="xs">
    <Box>{titleLabel}:</Box>
    <Divider />
    <EventTypesSelector selectedEvents={eventCategories} onChange={onChangeEventCategories} />
  </Group>
);

const EntryHeader = ({ desiredEventTypes, setDesiredEventTypes }) => {
  const { activePubSub, pubsubRegisterChat, pubsubUnregisterChat, events } = useStore(useCallback(s => s, []));

  const [showStatistics, setShowStatistics] = useBooleanToggle(false);
  const [showPubSubTooltip, setShowPubSubTooltip] = useBooleanToggle(false);
  const [showDesiredFilterTooltip, setShowDesiredFilterTooltip] = useBooleanToggle(false);
  const toggleToolTip_pubsub = () => setShowPubSubTooltip(!showPubSubTooltip);
  const toggleToolTip_desired = () => setShowDesiredFilterTooltip(!showDesiredFilterTooltip);

  const onPubSubChange = _eventCategories => pubsubRegisterChat({ connectTarget, eventCategories: _eventCategories });
  const onUnregister = () => pubsubUnregisterChat(connectTarget);

  const numEvents = events[activePubSub.pubsub.connectTarget].length;

  const {
    pubsub: { platformName, connectTarget, eventCategories }
  } = activePubSub;

  const colors = useMantineTheme().other.Platforms[platformName];
  const { classes: cssClasses } = StyledEventViewer(colors);

  return (
    <Group grow direction="column" className={`${cssClasses.PanelHeader}`}>
      <Group>
        <Title order={4}>{connectTarget}</Title>

        <Group className="options">
          <Popover
            opened={showDesiredFilterTooltip}
            onClose={() => setShowDesiredFilterTooltip(false)}
            withArrow
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
              eventCategories={eventCategories}
            />
          </Popover>

          <Tooltip withArrow arrowSize={4} position="left" label="Unregister">
            <ActionIcon variant="filled" color="red" onClick={onUnregister}>
              <MdLeakRemove />
            </ActionIcon>
          </Tooltip>
        </Group>
      </Group>

      <div className="statsThumb" onClick={() => setShowStatistics(s => !s)}>
        <Collapse
          className="stats-container"
          in={showStatistics}
          transitionDuration={1000}
          transitionTimingFunction="linear"
        >
          <span># Events: {numEvents}</span>
        </Collapse>
      </div>
    </Group>
  );
};

export default React.memo(EntryHeader);

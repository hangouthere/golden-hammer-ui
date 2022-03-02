import useStore, { type IStore } from '-/scripts/store';
import { StyledEventViewer } from '-/scripts/styles/eventViewer';
import {
  ActionIcon,
  Anchor,
  Box,
  Collapse,
  Divider,
  Group,
  Popover,
  Text,
  Title,
  Tooltip,
  useMantineTheme
} from '@mantine/core';
import { useBooleanToggle } from '@mantine/hooks';
import React, { useCallback } from 'react';
import { BsFilter } from 'react-icons/bs';
import { MdLeakAdd, MdLeakRemove } from 'react-icons/md';
import { VscClearAll } from 'react-icons/vsc';
import shallow from 'zustand/shallow';
import EventTypesSelector from '../../_shared/EventTypesSelector';

type EventCategories = string[];

type EventSelectorProps = {
  eventCategories: EventCategories;
  onChangeEventCategories: (types: EventCategories) => void;
  titleLabel: string;
};

const ConnectTargetEventSelector = ({ eventCategories, onChangeEventCategories, titleLabel }: EventSelectorProps) => (
  <Group m={3} direction="column" spacing="xs">
    <Box>{titleLabel}:</Box>
    <Divider />
    <EventTypesSelector selectedEvents={eventCategories} onChange={onChangeEventCategories} />
  </Group>
);

const getState = (s: IStore) => ({
  activePubSub: s.activePubSub,
  clearEvents: s.clearEvents,
  pubsubRegisterChat: s.pubsubRegisterChat,
  pubsubUnregisterChat: s.pubsubUnregisterChat,
  events: s.events[s.activePubSub!.pubsub.connectTarget],
  stats: s.stats[s.activePubSub!.pubsub.connectTarget]
});

type EntryHeaderProps = {
  desiredEventTypes: EventCategories;
  setDesiredEventTypes: (types: EventCategories) => void;
};

const EntryHeader = ({ desiredEventTypes, setDesiredEventTypes }: EntryHeaderProps) => {
  const { activePubSub, pubsubRegisterChat, pubsubUnregisterChat, clearEvents, events, stats } = useStore(
    getState,
    shallow
  );

  if (!activePubSub) {
    //! FIXME: See if this works at all, or should be removed
    return null;
  }

  const [showStatistics, setShowStatistics] = useBooleanToggle(false);
  const [showPubSubTooltip, setShowPubSubTooltip] = useBooleanToggle(false);
  const [showDesiredFilterTooltip, setShowDesiredFilterTooltip] = useBooleanToggle(false);
  const toggleToolTip_pubsub = useCallback(() => setShowPubSubTooltip(!showPubSubTooltip), []);
  const toggleToolTip_desired = useCallback(() => setShowDesiredFilterTooltip(!showDesiredFilterTooltip), []);

  const {
    pubsub: { platformName, connectTarget, eventCategories }
  } = activePubSub!;

  const onPubSubChange = useCallback(
    (eventCategories: EventCategories) => pubsubRegisterChat({ connectTarget, eventCategories }),
    [connectTarget, eventCategories]
  );
  const onClearEvents = useCallback(() => clearEvents(connectTarget), [connectTarget]);
  const onUnregister = useCallback(() => pubsubUnregisterChat(connectTarget), [connectTarget]);

  const colors = useMantineTheme().other.Platforms[platformName];
  const { classes: cssClasses } = StyledEventViewer(colors);

  return (
    <Group grow direction="column" className={`${cssClasses.PanelHeader}`}>
      <Group>
        <Title order={4}>
          <Anchor href={`https://twitch.tv/${connectTarget}`} target="_blank">
            {connectTarget}
          </Anchor>
        </Title>

        <Group className="options">
          <Tooltip withArrow arrowSize={4} position="left" label="Clear events">
            <ActionIcon variant="outline" color="yellow" onClick={onClearEvents}>
              <VscClearAll />
            </ActionIcon>
          </Tooltip>

          <Popover
            opened={showDesiredFilterTooltip}
            onClose={() => setShowDesiredFilterTooltip(false)}
            withArrow
            arrowSize={4}
            position="bottom"
            placement="end"
            width={250}
            target={
              <Tooltip withArrow arrowSize={4} position="left" label="Filter Events">
                <ActionIcon onClick={toggleToolTip_desired} variant="filled">
                  <BsFilter />
                </ActionIcon>
              </Tooltip>
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
              <Tooltip withArrow arrowSize={4} position="left" label="Toggle Events">
                <ActionIcon onClick={toggleToolTip_pubsub} variant="filled">
                  <MdLeakAdd />
                </ActionIcon>
              </Tooltip>
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
        <Collapse className="stats-container" in={showStatistics}>
          <span>
            <Tooltip
              position="bottom"
              withArrow={true}
              arrowSize={6}
              label={
                <Group direction="column" spacing="sm">
                  <Title order={5}>All Events</Title>
                  <Text size="sm">Viewing: {events.length}</Text>
                  <Text size="sm">Total Seen: {stats.TotalEvents || 0}</Text>
                </Group>
              }
            >
              <span className="label"># Events:</span> {events.length}/{stats.TotalEvents || 0}
            </Tooltip>
          </span>

          <span>
            <Tooltip
              position="bottom"
              withArrow={true}
              arrowSize={6}
              label={
                <Group direction="column" spacing="sm">
                  <Title order={5}>Monetization Events</Title>
                  <Text size="sm">Subscription: {stats['Monetization.Subscription'] || 0}</Text>
                  <Text size="sm">Tip: {stats['Monetization.Tip'] || 0}</Text>
                </Group>
              }
            >
              <span className="label">Earnings:</span> ${(stats.Earnings || 0).toFixed(2)}
            </Tooltip>
          </span>

          <span>
            <Tooltip
              position="bottom"
              withArrow={true}
              arrowSize={6}
              label={
                <Group direction="column" spacing="sm">
                  <Title order={5}>UserChat Events</Title>
                  <Text size="sm">Messages: {stats['UserChat.Message'] || 0}</Text>
                  <Text size="sm">Join/Parts: {stats['UserChat.Presence'] || 0}</Text>
                </Group>
              }
            >
              <span className="label">UserChat:</span> {stats.UserChat || 0}
            </Tooltip>
          </span>

          <span>
            <Tooltip
              position="bottom"
              withArrow={true}
              arrowSize={6}
              label={
                <Group direction="column" spacing="sm">
                  <Title order={5}>Administration Events</Title>
                  <Text size="sm">MessageRemoval: {stats['Administration.MessageRemoval'] || 0}</Text>
                  <Text size="sm">Timeout: {stats['Administration.Timeout'] || 0}</Text>
                  <Text size="sm">Ban: {stats['Administration.Ban'] || 0}</Text>
                </Group>
              }
            >
              <span className="label">Administration:</span> {stats.Administration || 0}
            </Tooltip>
          </span>
        </Collapse>
      </div>
    </Group>
  );
};

export default React.memo(EntryHeader);

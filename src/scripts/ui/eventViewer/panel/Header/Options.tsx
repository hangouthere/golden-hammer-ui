import EventTypesSelector from '-/scripts/ui/_shared/EventTypesSelector';
import { ActionIcon, Box, Divider, Group, Input, Popover, Tooltip } from '@mantine/core';
import { useInputState } from '@mantine/hooks';
import React, { useCallback, useEffect } from 'react';
import { BsFilter } from 'react-icons/bs';
import { MdLeakAdd, MdLeakRemove, MdOutlineClear, MdSearch } from 'react-icons/md';
import { VscClearAll } from 'react-icons/vsc';
import type { EventCategories } from '.';

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

type Props = {
  desiredEventTypes: EventCategories;
  eventCategories: EventCategories;
  showDesiredFilterTooltip: boolean;
  showPubSubTooltip: boolean;
  onClearEvents: () => void;
  onPubSubChange: (c: EventCategories) => void;
  onUnregister: () => void;
  setDesiredEventTypes: (c: EventCategories) => void;
  setShowDesiredFilterTooltip: (v: boolean) => void;
  setShowPubSubTooltip: (v: boolean) => void;
  toggleToolTip_desired: () => void;
  toggleToolTip_pubsub: () => void;

  searchTerm: string;
  setSearchTerm: (t: string) => void;
};

export default function Options({
  desiredEventTypes,
  eventCategories,
  onClearEvents,
  onPubSubChange,
  onUnregister,
  setDesiredEventTypes,
  setShowDesiredFilterTooltip,
  setShowPubSubTooltip,
  showDesiredFilterTooltip,
  showPubSubTooltip,
  toggleToolTip_desired,
  toggleToolTip_pubsub,
  searchTerm,
  setSearchTerm
}: Props) {
  const [searchInputVal, onUpdateSearchTerm] = useInputState(searchTerm);

  const onClearSearch = useCallback(() => {
    onUpdateSearchTerm('');
  }, [onUpdateSearchTerm]);

  useEffect(() => {
    setSearchTerm(searchInputVal);
  }, [searchInputVal]);

  const rightIcon = !!searchInputVal ? (
    <ActionIcon radius="xl" size="xs" color="" variant="filled" onClick={onClearSearch}>
      <MdOutlineClear />
    </ActionIcon>
  ) : (
    <MdSearch />
  );

  return (
    <Group className="options">
      <Input value={searchTerm} onChange={onUpdateSearchTerm} rightSection={rightIcon} size="xs" placeholder="Search" />

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
  );
}

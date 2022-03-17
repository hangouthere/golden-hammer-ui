import EventTypesSelector from '-/scripts/ui/_shared/EventTypesSelector';
import { ActionIcon, Box, Divider, Group, Input, Popover, Tooltip } from '@mantine/core';
import { useInputState } from '@mantine/hooks';
import { type EventClassifications } from 'golden-hammer-shared';
import React, { useCallback, useEffect } from 'react';
import { BsFilter } from 'react-icons/bs';
import { MdLeakAdd, MdLeakRemove, MdOutlineClear, MdSearch } from 'react-icons/md';
import { VscClearAll } from 'react-icons/vsc';

type EventSelectorProps = {
  eventClassifications: EventClassifications;
  onChangeEventClassifications: (types: EventClassifications) => void;
  titleLabel: string;
};

const ConnectTargetEventSelector = ({ eventClassifications, onChangeEventClassifications, titleLabel }: EventSelectorProps) => (
  <Group m={3} direction="column" spacing="xs">
    <Box>{titleLabel}:</Box>
    <Divider />
    <EventTypesSelector selectedEvents={eventClassifications} onChange={onChangeEventClassifications} />
  </Group>
);

type Props = {
  desiredEventTypes: EventClassifications;
  eventClassifications: EventClassifications;
  showDesiredFilterTooltip: boolean;
  showPubSubTooltip: boolean;
  onClearEvents: () => void;
  onPubSubChange: (c: EventClassifications) => void;
  onUnregister: () => void;
  setDesiredEventTypes: (c: EventClassifications) => void;
  setShowDesiredFilterTooltip: (v: boolean) => void;
  setShowPubSubTooltip: (v: boolean) => void;
  toggleToolTip_desired: () => void;
  toggleToolTip_pubsub: () => void;

  searchTerm: string;
  setSearchTerm: (t: string) => void;
};

export default function Options({
  desiredEventTypes,
  eventClassifications,
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
          onChangeEventClassifications={setDesiredEventTypes}
          eventClassifications={desiredEventTypes}
        />
      </Popover>

      <Popover
        opened={showPubSubTooltip}
        onClose={() => setShowPubSubTooltip(false)}
        withArrow
        arrowSize={4}
        position="bottom"
        placement="end"
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
          onChangeEventClassifications={onPubSubChange}
          eventClassifications={eventClassifications}
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

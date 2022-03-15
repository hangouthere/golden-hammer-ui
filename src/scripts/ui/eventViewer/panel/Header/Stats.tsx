import type { IStore } from '-/scripts/store';
import { Collapse, Group, Text, Title, Tooltip } from '@mantine/core';
import { useBooleanToggle } from '@mantine/hooks';
import React from 'react';

type Props = {
  events: IStore['events'][string];
  stats: IStore['stats'][string];
};

export default function HeaderStats({ stats, events }: Props) {
  const [showStatistics, setShowStatistics] = useBooleanToggle(false);

  return (
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

        <span>
          <Tooltip
            position="bottom"
            withArrow={true}
            arrowSize={6}
            label={
              <Group direction="column" spacing="sm">
                <Title order={5}>PlatformSpecific Events</Title>
                <Text size="sm">Total: {stats['PlatformSpecific.undefined'] || 0}</Text>
              </Group>
            }
          >
            <span className="label">PlatformSpecific:</span> {stats['PlatformSpecific.undefined'] || 0}
          </Tooltip>
        </span>
      </Collapse>
    </div>
  );
}

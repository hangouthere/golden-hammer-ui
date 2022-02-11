import { StyledAccordion } from '-/styles/accordion';
import { StyledInputs } from '-/styles/inputs';
import { Accordion, ActionIcon, Divider, Group, TextInput, Title } from '@mantine/core';
import React, { useState } from 'react';
import { MdLeakAdd } from 'react-icons/md';
import EventTypesSelector, { GHPubSub_EventTypes } from '../EventTypesSelector';

export default function PubSubRegisterPanel() {
  const [selectedEvents, setSelectedEvents] = useState(GHPubSub_EventTypes);

  const {
    classes: { SimpleTextInputWithButton }
  } = StyledInputs();

  const {
    classes: { Compact }
  } = StyledAccordion();

  const onChangeEvents = registerEvents => {
    console.log('New Events', registerEvents);

    setSelectedEvents(registerEvents);
  };

  return (
    <>
      <Divider />

      <Group className={SimpleTextInputWithButton}>
        <TextInput
          placeholder="Enter Twitch Channel Name"
          label="Twitch Channel Name"
          description="Listen to GH PubSub Events for a specified Twitch Channel"
          size="xs"
        />

        <ActionIcon>
          <MdLeakAdd />
        </ActionIcon>
      </Group>

      <Accordion className={Compact}>
        <Accordion.Item label={<Title order={6}>Select PubSub Events</Title>}>
          <EventTypesSelector onChange={onChangeEvents} selectedEvents={selectedEvents} />
        </Accordion.Item>
      </Accordion>
    </>
  );
}

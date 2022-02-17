import { IStore } from '-/store';
import { StyledAccordion } from '-/styles/accordion';
import { StyledInputs } from '-/styles/inputs';
import { Accordion, Button, Divider, Space, TextInput, Title } from '@mantine/core';
import { useBooleanToggle, useForm } from '@mantine/hooks';
import React, { useState } from 'react';
import { MdLeakAdd } from 'react-icons/md';
import EventTypesSelector, { GHPubSub_EventTypes } from '../_shared/EventTypesSelector';

type Props = {
  pubSubRegister: IStore['pubsubRegisterChat'];
  disabled: boolean;
};

export default function PubSubRegisterPanel({ disabled, pubSubRegister }: Props) {
  const [isValid, setIsValid] = useBooleanToggle(false);
  const [selectedEvents, setSelectedEvents] = useState([...GHPubSub_EventTypes]);

  const {
    classes: { SimpleTextInputWithButton }
  } = StyledInputs();

  const {
    classes: { Compact }
  } = StyledAccordion();

  const pubSubReg = useForm({
    initialValues: {
      connectTarget: ''
    },
    validationRules: {
      connectTarget: (v: string) => v.length >= 3
    }
  });

  const onChangeEvents = registerEvents => setSelectedEvents(registerEvents);

  const onFormChange = () => setIsValid(pubSubReg.validate());
  const onFormSubmitted = ({ connectTarget }) => {
    pubSubRegister({ connectTarget, eventCategories: selectedEvents });
    setSelectedEvents([...GHPubSub_EventTypes]);
    setIsValid(false);
    pubSubReg.reset();
    pubSubReg.resetErrors();
  };

  return (
    <>
      <Divider />

      <form className={SimpleTextInputWithButton} onKeyUp={onFormChange} onSubmit={pubSubReg.onSubmit(onFormSubmitted)}>
        <TextInput
          placeholder="Enter Twitch Channel Name"
          label="Twitch Channel Name"
          description="Listen to GH PubSub Events for a specified Twitch Channel"
          size="xs"
          disabled={disabled}
          {...pubSubReg.getInputProps('connectTarget')}
        />

        <Space w="sm" />

        <Button leftIcon={<MdLeakAdd />} compact type="submit" disabled={disabled || !isValid}>
          PubSub
        </Button>
      </form>

      <Accordion className={Compact}>
        <Accordion.Item label={<Title order={6}>Select PubSub Events</Title>}>
          <EventTypesSelector onChange={onChangeEvents} selectedEvents={selectedEvents} />
        </Accordion.Item>
      </Accordion>
    </>
  );
}

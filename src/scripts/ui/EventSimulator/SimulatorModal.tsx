import useStore from '-/scripts/store/index.js';
import { StyledMisc } from '-/scripts/styles/misc.js';
import {
  ActionIcon,
  Button,
  CloseButton,
  Group,
  OptionalPortal,
  Paper,
  Select,
  Text,
  TextInput,
  Textarea,
  Tooltip,
  Transition,
  type ModalProps
} from '@mantine/core';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
import { default as createStyles } from '@mantine/core/esm/components/Modal/Modal.styles';
import { useBooleanToggle, useDisclosure, useForm } from '@mantine/hooks';
import { getDefaultZIndex } from '@mantine/styles';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ChangeEvent,
  type MouseEvent as ReactMouseEvent
} from 'react';
import { MdOutlineBolt } from 'react-icons/md';
import SimulatedEvents, { SelectOptions } from './SimulatedEvents.js';

const defaultProps: Partial<ModalProps> = {
  closeOnClickOutside: true,
  closeOnEscape: true,
  overflow: 'outside',
  padding: 'lg',
  shadow: 'lg',
  size: 'md',
  transition: 'pop',
  transitionDuration: 250,
  trapFocus: true,
  withCloseButton: true,
  withinPortal: true,
  zIndex: getDefaultZIndex('modal')
};

export default function SimulatorModal() {
  const simulateSourceEvent = useStore(s => s.simulateSourceEvent);

  const [opened, handlers] = useDisclosure(false);
  const selectData = useMemo(SelectOptions, []);
  const [eventData, setEventData] = useState({});
  const [modalOffset, setModalOffset] = useState({ x: 0, y: 0 });
  const [modalPosition, setModalPosition] = useState({ x: 400, y: 50 });
  const [isDragging, setIsDragging] = useBooleanToggle(false);

  const simForm = useForm({
    initialValues: {
      simulatedEventProfile: '',
      simulatedEventText: '',
      userName: 'JustinFan' + Date.now().toString().substring(0, 4)
    }
  });

  type FormValues = typeof simForm.values;

  const { classes: ModalClasses } = createStyles(
    {
      overflow: defaultProps.overflow,
      size: defaultProps.size,
      centered: true,
      zIndex: defaultProps.zIndex
    },
    { name: 'Modal' }
  );

  const { cx, classes: SimulatorModalClasses } = StyledMisc();

  const closeOnEscapePress = useCallback(
    (event: KeyboardEvent) => {
      if (event.code === 'Escape') {
        handlers.close();
      }
    },
    [handlers]
  );

  const dragToggle = (event: ReactMouseEvent, isDragging: boolean) => {
    const modalDom = event.currentTarget as HTMLElement;
    const modalStyle = window.getComputedStyle(modalDom);

    const offset = {
      x: (parseInt(modalStyle.left) || 0) - event.pageX,
      y: (parseInt(modalStyle.top) || 0) - event.pageY
    };

    setModalOffset(offset);
    setIsDragging(isDragging);
  };

  const onMouseMove = useCallback(
    (event: MouseEvent) => {
      const _mousePos = {
        x: event.pageX,
        y: event.pageY
      };

      const newPosition = {
        x: modalOffset.x + _mousePos.x,
        y: modalOffset.y + _mousePos.y
      };

      setModalPosition(newPosition);
    },
    [modalOffset]
  );

  const onStartDrag = useCallback(
    (event: ReactMouseEvent) => {
      // Don't activate drag for main part of modal
      const offsetY = event.pageY - event.currentTarget.getBoundingClientRect().top;
      if (offsetY > 50) {
        return;
      }

      dragToggle(event, true);

      document.body.addEventListener('mousemove', onMouseMove);
    },
    [onMouseMove, dragToggle]
  );

  const onEndDrag = useCallback(
    (event: ReactMouseEvent) => {
      // Don't activate drag for main part of modal
      const offsetY = event.pageY - event.currentTarget.getBoundingClientRect().top;
      if (offsetY > 50) {
        return;
      }
      dragToggle(event, false);

      document.body.removeEventListener('mousemove', onMouseMove);
    },
    [onMouseMove, dragToggle]
  );

  const onSimulate = useCallback(
    (_values: FormValues) => {
      reRandomize();
      simulateSourceEvent(eventData);
    },
    [simulateSourceEvent, eventData]
  );

  const updateSimEventText = (profileName: string, username: string) => {
    const chosenProfile = SimulatedEvents[profileName];
    const newEventData = chosenProfile(username);

    simForm.setFieldValue('simulatedEventText', JSON.stringify(newEventData, null, 2));
    setEventData(newEventData);
  };

  const onUpdateProfile = useCallback(
    (value: string) => {
      simForm.setFieldValue('simulatedEventProfile', value);

      updateSimEventText(value, simForm.values.userName);
    },
    [simForm, updateSimEventText]
  );

  const onUpdateUserName = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      simForm.setFieldValue('userName', event.currentTarget.value);

      const { simulatedEventProfile } = simForm.values;

      if (!simulatedEventProfile) {
        return;
      }

      updateSimEventText(simulatedEventProfile, event.currentTarget.value);
    },
    [simForm, updateSimEventText]
  );

  const reRandomize = useCallback(
    () => updateSimEventText(simForm.values.simulatedEventProfile, simForm.values.userName),
    [updateSimEventText, simForm.values]
  );

  useEffect(() => {
    window.addEventListener('keydown', closeOnEscapePress);

    return () => {
      window.removeEventListener('keydown', closeOnEscapePress);
    };
  }, [closeOnEscapePress]);

  useEffect(() => {
    if (isDragging) {
      document.body.addEventListener('mousemove', onMouseMove);
    } else {
      document.body.removeEventListener('mousemove', onMouseMove);
    }

    return () => document.body.removeEventListener('mousemove', onMouseMove);
  }, [isDragging]);

  return (
    <>
      <Tooltip withArrow label="Native Event Simulator" position="bottom">
        <ActionIcon variant={opened ? 'filled' : 'light'} color="yellow" onClick={handlers.open}>
          <MdOutlineBolt />
        </ActionIcon>
      </Tooltip>

      <OptionalPortal zIndex={200}>
        <Transition mounted={opened} transition="slide-down">
          {transitionStyles => {
            const appliedStyles: React.CSSProperties = {
              marginLeft: 'calc(var(--removed-scroll-width, 0px) * -1)',
              ...transitionStyles,
              zIndex: 3,
              position: 'absolute',
              left: `${modalPosition.x}px`,
              top: `${modalPosition.y}px`
            };

            if (isDragging) {
              appliedStyles.opacity = '0.3';
            }

            return (
              <div className={cx(ModalClasses.root, SimulatorModalClasses.SimulatorModalRoot)}>
                <Paper<'div'>
                  onMouseDown={onStartDrag}
                  onMouseUp={onEndDrag}
                  className={cx(ModalClasses.modal, SimulatorModalClasses.SimulatorModal)}
                  shadow={defaultProps.shadow}
                  p={defaultProps.padding}
                  radius={defaultProps.radius}
                  role="dialog"
                  style={appliedStyles}
                >
                  <div className={ModalClasses.header}>
                    <Text className={ModalClasses.title}>Native Event Simulator</Text>

                    <CloseButton
                      iconSize={16}
                      onClick={handlers.close}
                      aria-label="Close"
                      className={ModalClasses.close}
                    />
                  </div>

                  <div className={ModalClasses.body}>
                    <form onSubmit={simForm.onSubmit(onSimulate)}>
                      <Select
                        label="Event to Simulate"
                        placeholder="Pick One"
                        data={selectData}
                        {...simForm.getInputProps('simulatedEventProfile')}
                        onChange={onUpdateProfile}
                      />

                      <TextInput
                        mt="sm"
                        label="UserName"
                        placeholder="UserName"
                        {...simForm.getInputProps('userName')}
                        onChange={onUpdateUserName}
                      />

                      <Textarea
                        autosize
                        readOnly
                        placeholder="Simulated Event Data"
                        label="Simulated Event Data"
                        maxRows={10}
                        {...simForm.getInputProps('simulatedEventText')}
                      />

                      <Group mt="sm" position="right">
                        <Button color="red" type="submit" disabled={!simForm.values.simulatedEventProfile}>
                          Simulate
                        </Button>
                      </Group>
                    </form>
                  </div>
                </Paper>
              </div>
            );
          }}
        </Transition>
      </OptionalPortal>
    </>
  );
}

import { StyledButton } from '-/scripts/styles/buttons.js';
import {
  ActionIcon,
  Button,
  ColorSwatch,
  Group,
  Popover,
  Title,
  useMantineTheme,
  type GroupProps
} from '@mantine/core';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore-next-line
import useButtonStyles from '@mantine/core/esm/components/Button/Button.styles';
import { useBooleanToggle } from '@mantine/hooks';
import type { ConnectTargetClassificationsAssociation, EventClassifications } from 'golden-hammer-shared';
import { MdLeakAdd } from 'react-icons/md';
import EventTypesSelector from '../_shared/EventTypesSelector.js';

type EventSelectorProps = {
  eventClassifications: EventClassifications;
  onChangeEventClassifications: (types: EventClassifications) => void;
  SimpleRollOverClassName: string;
  unregisterPubSub: () => void;
};

const ConnectTargetEventSelector = ({
  eventClassifications,
  onChangeEventClassifications,
  SimpleRollOverClassName,
  unregisterPubSub
}: EventSelectorProps) => (
  <Group m={3} direction="column" grow>
    <EventTypesSelector selectedEvents={eventClassifications} onChange={onChangeEventClassifications} />

    <Group position="right">
      <Button radius="xl" size="xs" className={SimpleRollOverClassName} onClick={unregisterPubSub}>
        Unregister
      </Button>
    </Group>
  </Group>
);

type Props = Omit<GroupProps, 'children'> & {
  connectTargetClassificationsAssociation: ConnectTargetClassificationsAssociation;
  reSubEventClassifications: (conTrgtCtgsAssoc: ConnectTargetClassificationsAssociation) => void;
  unregisterPubSub: (connectTarget: string) => void;
  hasUpdates: boolean;
};

export default function ConnectedTargetNavItem({
  connectTargetClassificationsAssociation: { connectTarget, eventClassifications },
  reSubEventClassifications,
  unregisterPubSub,
  hasUpdates,
  ...restProps
}: Props) {
  const theme = useMantineTheme();
  const [showConfig, setShowConfig] = useBooleanToggle(false);

  const toggleConfig = () => setShowConfig(!showConfig);

  const onChangeEventClassifications = (eventClassifications: EventClassifications) =>
    reSubEventClassifications({ connectTarget, eventClassifications });

  const {
    classes: { root, default: defaultStyle },
    cx
  } = useButtonStyles(
    {
      radius: 'md',
      color: 'red',
      size: 'md',
      fullWidth: false,
      compact: false,
      gradientFrom: '',
      gradientTo: '',
      gradientDeg: 0
    },
    { classNames: {}, styles: {}, name: 'ButtonInButton' }
  );

  const {
    classes: { ButtonInButton, SimpleRollOver }
  } = StyledButton(theme.other.CautionButton);

  const onUnregisterPubSub = () => {
    unregisterPubSub(connectTarget);
  };

  return (
    <Group
      grow
      spacing="lg"
      className={cx(restProps.className, root, defaultStyle, ButtonInButton)}
      onClick={restProps.onClick}
    >
      <Title order={5}>{connectTarget}</Title>

      <Group position="right">
        <ColorSwatch size={8} color={hasUpdates ? 'red' : 'grey'} />

        <Popover
          withArrow
          arrowSize={4}
          opened={showConfig}
          position="right"
          placement="start"
          onClose={() => setShowConfig(false)}
          target={
            <ActionIcon onClick={toggleConfig} variant="filled">
              <MdLeakAdd />
            </ActionIcon>
          }
        >
          <ConnectTargetEventSelector
            onChangeEventClassifications={onChangeEventClassifications}
            SimpleRollOverClassName={SimpleRollOver}
            eventClassifications={eventClassifications}
            unregisterPubSub={onUnregisterPubSub}
          />
        </Popover>
      </Group>
    </Group>
  );
}

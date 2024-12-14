import '../App.css';
import { useContext } from 'react';
import { MidiDevice } from '../../common/types';
import { AppContext } from '../AppContext';
import { Button, Container, Stack } from 'react-bootstrap';
import { AssignedMacrosList } from './assigned-macros-list';

type ManageDeviceProps = {
  device: MidiDevice;
  handleReturn: () => void;
};

export const ManageDevice = ({ device, handleReturn }: ManageDeviceProps) => {
  const { macrosByNoteId } = useContext(AppContext);

  const triggerIds = Object.keys(macrosByNoteId).filter((id) =>
    id.startsWith(device.id),
  );
  const macroCount = triggerIds.length;

  return (
    <Stack>
      <Container fluid>
        <Button size="sm" variant="secondary" onClick={() => handleReturn()}>
          « Back
        </Button>
      </Container>
      <Stack>
        <h2>{device.name}</h2>
        <div className="deviceManufacturer">{device.manufacturer}</div>
        <div className="deviceMacros">{macroCount} Macros Assigned</div>
        <AssignedMacrosList device={device} />
      </Stack>
    </Stack>
  );
};

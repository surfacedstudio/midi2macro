import '../App.css';
import { useContext, useState } from 'react';
import { MidiDevice } from '../../common/types';
import { AppContext } from '../AppContext';
import { Stack, Card, Form } from 'react-bootstrap';
import { DeviceInfo } from './device-info';
import { NoteHistory } from './note-history';
import { AssignedMacrosList } from './assigned-macros-list';

type DeviceListProps = {
  handleSelect: (device: MidiDevice) => void;
};

export const DeviceList = ({ handleSelect }: DeviceListProps) => {
  const [hideInactiveDevices, setHideInactiveDevices] = useState(false);
  const { devices, noteHistory } = useContext(AppContext);

  const devicesToShow = hideInactiveDevices
    ? devices.filter((d) => noteHistory.some((n) => n.id.startsWith(d.id)))
    : devices.concat([]);

  devicesToShow.sort((a, b) => {
    return (
      noteHistory.findIndex((n) => n.deviceId === b.id) -
      noteHistory.findIndex((n) => n.deviceId === a.id)
    );
  });

  return (
    <Stack gap={2}>
      <div>
        <h1>Found {devices?.length} MIDI devices</h1>
        <Form.Check
          type="checkbox"
          label="Hide inactive devices"
          onClick={() => setHideInactiveDevices(!hideInactiveDevices)}
        />
      </div>
      {devicesToShow.map((device) => (
        <Card key={device.id} className="deviceCard">
          <Card.Body>
            <Stack gap={3}>
              <div>
                <div style={{ float: 'left' }}>
                  <DeviceInfo device={device} />
                </div>
                <div style={{ float: 'right' }}>
                  <div className="deviceManufacturer">
                    {device.manufacturer}
                  </div>
                </div>
              </div>
              <AssignedMacrosList device={device} />
              <NoteHistory device={device} />
            </Stack>

            {/* <div style={{ float: 'right' }}>
                  <Button
                    variant="primary"
                    onClick={() => handleSelect(device)}
                  >
                    Edit Macros
                  </Button>
                </div> */}
          </Card.Body>
        </Card>
      ))}
    </Stack>
  );
};

import '../App.css';
import { useContext } from 'react';
import { MidiDevice } from '../../common/types';
import { AppContext } from '../AppContext';
import { Stack } from 'react-bootstrap';

type DeviceInfoProps = {
  device: MidiDevice;
};

export const DeviceInfo = ({ device }: DeviceInfoProps) => {
  const { noteHistory } = useContext(AppContext);
  const lastNote = noteHistory.find((n) => n.deviceId === device.id);

  return (
    <Stack
      key={`${device.id}-${lastNote?.eventTime}`}
      className="jumpAnimation"
    >
      <h2>{device.name}</h2>
    </Stack>
  );
};

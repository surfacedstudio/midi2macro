import { WebMidi, Input } from 'webmidi';
import { MidiDevice, MidiNote } from '../../common/types';

type MidiEventHandler = (note: MidiNote) => any;
type DeviceChangeHandler = (value: React.SetStateAction<MidiDevice[]>) => void;

class AppMidi {
  private resetTimeoutByPressedNoteId: Record<string, NodeJS.Timeout> = {};
  private initialised: boolean = false;
  private devices: MidiDevice[] = [];
  private setDevices: DeviceChangeHandler | null = null;
  private midiEventHandler: MidiEventHandler | null = null;

  async initialise(
    setDevices: DeviceChangeHandler,
    midiEventHandler: MidiEventHandler,
  ) {
    if (this.initialised) {
      console.error('MIDI: Midi already initialised');
      return;
    }

    try {
      this.setDevices = setDevices;
      this.midiEventHandler = midiEventHandler;
      await WebMidi.enable();

      // Register connection handlers
      this.registerConnectionHandlers();

      (WebMidi.inputs || []).forEach((input, index) => {
        const device = this.convertInputToMidiDevice(input);

        // console.log(
        //   `MIDI: ${index}: ${device.id} - ${device.name} - connection ${device.connection}`,
        // );

        this.registerMidiEventHandler(device);
        this.devices.push(device);
      });

      // console.log(`MIDI: ${this.devices.length} devices found`);

      this.setDevices!(this.devices.concat([])); // Change reference
      this.initialised = true;
    } catch (error: any) {
      console.error(error);
    }
  }

  registerConnectionHandlers() {
    WebMidi.addListener('connected', (event) => {
      const { port } = event;

      // Don't process outputs
      if (port.type === 'output') {
        return;
      }

      const device = this.convertInputToMidiDevice(port);

      // console.log(
      //   'MIDI: Connected device',
      //   `${device.id} - ${device.name} - connection ${device.connection}`,
      // );

      // Only add once
      if (this.devices.findIndex((d) => d.id === device.id) === -1) {
        this.registerMidiEventHandler(device);
        this.devices.push(device);
        this.setDevices!(this.devices.concat([])); // Change reference
      }
    });

    WebMidi.addListener('disconnected', (event) => {
      const { port } = event;

      // Don't process outputs
      if (port.type === 'output') {
        return;
      }

      const device = this.convertInputToMidiDevice(port);
      // console.log(
      //   'MIDI: Disconnected device',
      //   `${device.id} - ${device.name} - connection ${device.connection}`,
      // );

      // Only remove if it exists
      const index = this.devices.findIndex((d) => d.id === device.id);
      if (index !== -1) {
        this.unregisterMidiEventHandler(device);
        this.devices.splice(index, 1);
        this.setDevices!(this.devices.concat([])); // Change reference
      }
    });
  }

  debounce(func: any, timeout = 300) {
    let timer: NodeJS.Timeout;
    return (...args: any[]) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        func.apply(this, args);
      }, timeout);
    };
  }

  registerMidiEventHandler(device: MidiDevice) {
    // TODO: handle control messages / buttons
    // device.input.addListener('midimessage', async (e: any) => {
    // });

    // Listen to the device
    device.input.addListener('noteon', async (e: any) => {
      const id = `${device.id}-${e.note.name}${e.note.octave}${
        e.note.accidental || ''
      }`;

      // // Note is still pressed
      // if (this.resetTimeoutByPressedNoteId[id]) {
      //   return;
      // }

      // this.resetTimeoutByPressedNoteId[id] = setTimeout(
      //   () => delete this.resetTimeoutByPressedNoteId[id],
      //   5000,
      // );

      const midiNote: MidiNote = {
        id,
        deviceId: device.id,
        deviceName: `${device.manufacturer} ${device.name}`,
        name: `${e.note.name}${e.note.octave}${e.note.accidental || ''}`,
        eventTime: new Date().getTime(),
      };

      this.midiEventHandler!(midiNote);
    });

    // device.input.addListener('noteoff', async (e: any) => {
    //   const id = `${device.id}-${e.note.name}${e.note.octave}${
    //     e.note.accidental || ''
    //   }`;
    //   delete this.resetTimeoutByPressedNoteId[id];
    // });
  }

  unregisterMidiEventHandler(device: MidiDevice) {
    device.input.removeListener('noteon');
  }

  convertInputToMidiDevice(input: Input) {
    const {
      id, // input-1, input-0
      name,
      manufacturer,
      state,
      type,
      octaveOffset,
      connection,
    } = input;

    const device = {
      id: `${manufacturer}-${name}-${id}`,
      name,
      manufacturer,
      state,
      type,
      octaveOffset,
      connection,
      input,
    };

    return device;
  }
}

export const appMidi = new AppMidi();

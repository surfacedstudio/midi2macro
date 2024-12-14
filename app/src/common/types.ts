import { Input } from 'webmidi';
import Electron from 'electron';

export type Channels =
  | 'ipc-example'
  | 'select-folder'
  | 'select-app'
  | 'load-macros'
  | 'assign-macro'
  | 'delete-macro'
  | 'execute-macro'
  | 'key-pressed'
  | 'menu-event'
  | 'open-external-url';

export type Modal = 'assign-macro' | 'confirm-delete' | 'about-modal';

export type MidiDevice = {
  id: string;
  name: string;
  manufacturer: string;
  state: string;
  type: string;
  octaveOffset: number;
  connection: string;
  input: Input;
};

export type MidiNote = {
  id: string;
  name: string;
  deviceId: string;
  deviceName: string;
  eventTime: number;
};

export type MacroActionType =
  | 'Open Folder'
  | 'Launch App'
  | 'Trigger Shortcut'
  | 'Play Sound'
  | 'Wait';

export type MacroAction = {
  midiNote: MidiNote;
  type: MacroActionType;
};

export type MacroActionOpenFolder = MacroAction & {
  type: 'Open Folder';
  directory: string;
};

export type MacroActionLaunchApp = MacroAction & {
  type: 'Launch App';
  path: string;
};

export type MacroActionTriggerShortcut = MacroAction & {
  type: 'Trigger Shortcut';
  keys: string[];
};

export type MacroActionPlaySound = MacroAction & {
  type: 'Play Sound';
  sound: 'bing' | 'alarm';
};

export type MacroActionWait = MacroAction & {
  type: 'Wait';
  durationInMs: number;
};

export type macrosByNoteId = Record<string, MacroAction>;

export type InputHandler = (
  event: Electron.Event,
  input: Electron.Input,
) => void;

export type KeyInput = Electron.Input;

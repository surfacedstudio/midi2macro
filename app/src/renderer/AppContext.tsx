/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { createContext, useEffect, useState, useMemo } from 'react';
import {
  MidiDevice,
  MidiNote,
  macrosByNoteId,
  MacroAction,
  KeyInput,
} from '../common/types';
import { appMidi } from './utils/midi';
import { ipcClient } from './utils/ipc-client';
import { IS_DEMO } from '../common/globals';

type MidiAppContext = {
  currentMacroKeys: string[];
  clearCurrentMacroKeys: () => void;
  devices: MidiDevice[];
  noteHistory: MidiNote[];
  macrosByNoteId: macrosByNoteId;
  selectedMacro: MacroAction | null;
  selectedMidiNote: MidiNote | null;
  showAssignMacroModal: (midiNote: MidiNote, action?: MacroAction) => void;
  hideAssignMacroModal: () => void;
  assignedMacroModalVisible: boolean;
  showDeleteMacroModal: (action: MacroAction) => void;
  hideDeleteMacroModal: () => void;
  deleteMacroModalVisible: boolean;
  hideAboutModal: () => void;
  aboutModalVisible: boolean;
  hideDemoModal: () => void;
  showDemoModal: () => void;
  demoModalVisible: boolean;
  assignMacro: (action: MacroAction) => void;
  deleteMacro: (action: MacroAction) => void;
};

export const AppContext = createContext<MidiAppContext>({
  currentMacroKeys: [],
  clearCurrentMacroKeys: () => {},
  devices: [],
  noteHistory: [],
  macrosByNoteId: {},
  selectedMacro: null,
  selectedMidiNote: null,
  showAssignMacroModal: (midiNote: MidiNote, action?: MacroAction) => {},
  hideAssignMacroModal: () => {},
  assignedMacroModalVisible: false,
  showDeleteMacroModal: (action: MacroAction) => {},
  hideDeleteMacroModal: () => {},
  deleteMacroModalVisible: false,
  hideAboutModal: () => {},
  aboutModalVisible: false,
  hideDemoModal: () => {},
  showDemoModal: () => {},
  demoModalVisible: false,
  assignMacro: (action: MacroAction) => {},
  deleteMacro: (action: MacroAction) => {},
});

type AppContextProviderProps = React.PropsWithChildren<{}>;

export const AppContextProvider = ({ children }: AppContextProviderProps) => {
  const [currentMacroKeys, setCurrentMacroKeys] = useState<string[]>([]);
  const [devices, setDevices] = useState<MidiDevice[]>([]);
  const [noteHistory, setNoteHistory] = useState<MidiNote[]>([]);

  const [macrosByNoteId, setMacrosByNoteId] = useState<macrosByNoteId>({});

  const [selectedMacro, setSelectedMacro] = useState<MacroAction | null>(null);
  const [selectedMidiNote, setSelectedMidiNote] = useState<MidiNote | null>(
    null,
  );

  const [assignedMacroModalVisible, setAssignedMacroModalVisible] =
    useState(false);
  const [deleteMacroModalVisible, setDeleteMacroModalVisible] = useState(false);
  const [aboutModalVisible, setAboutModalVisible] = useState(false);
  const [demoModalVisible, setDemoModalVisible] = useState(false);

  useEffect(() => {
    const loadMidi = async () => {
      const noteHistoryHandler = (note: MidiNote) => {
        setNoteHistory((notes) => [note].concat(notes).slice(0, 10));
        ipcClient.executeMacro(note.id);
      };

      const midiDevices = await appMidi.initialise(
        setDevices,
        noteHistoryHandler,
      );
    };

    const loadMacros = async () => {
      const newMacros = await ipcClient.loadMacros();
      setMacrosByNoteId(newMacros);
    };

    const registerKeyListener = async () => {
      ipcClient.registerKeyListener((input) => {
        setCurrentMacroKeys(input);
      });
    };

    const registerMenuListener = async () => {
      ipcClient.registerMenuListener((event) => {
        // console.log('Menu event', event);

        if (event === 'show-about-modal') setAboutModalVisible(true);
      });
    };

    loadMidi();
    loadMacros();
    registerKeyListener();
    registerMenuListener();
  }, []);

  const clearCurrentMacroKeys = () => {
    setCurrentMacroKeys([]);
  };

  const showAssignMacroModal = async (note: MidiNote, action?: MacroAction) => {
    setSelectedMidiNote(note);
    if (action) {
      setSelectedMacro(action);
    }
    setAssignedMacroModalVisible(true);
  };

  const hideAssignMacroModal = () => {
    setSelectedMacro(null);
    setSelectedMidiNote(null);
    setAssignedMacroModalVisible(false);
  };

  const showDeleteMacroModal = async (action: MacroAction) => {
    setSelectedMacro(action);
    setDeleteMacroModalVisible(true);
  };

  const hideDeleteMacroModal = () => {
    setSelectedMacro(null);
    setSelectedMidiNote(null);
    setDeleteMacroModalVisible(false);
  };

  const hideAboutModal = () => {
    setAboutModalVisible(false);
  };

  const hideDemoModal = () => {
    setDemoModalVisible(false);
  };

  const showDemoModal = () => {
    setDemoModalVisible(true);
  };

  const assignMacro = async (action: MacroAction) => {
    setMacrosByNoteId((macros) => {
      if (IS_DEMO && Object.keys(macros).length >= 5) {
        setDemoModalVisible(true);
        return macros;
      }

      macros[action.midiNote.id] = action;
      return macros;
    });

    await ipcClient.assignMacro(action);
  };

  const deleteMacro = async (action: MacroAction) => {
    setMacrosByNoteId((macros) => {
      if (macros[action.midiNote.id]) {
        delete macros[action.midiNote.id];
      }
      return macros;
    });

    await ipcClient.deleteMacro(action);
  };

  const contextData = useMemo(
    () => ({
      currentMacroKeys,
      clearCurrentMacroKeys,
      devices,
      noteHistory,
      macrosByNoteId,
      selectedMacro,
      selectedMidiNote,
      showAssignMacroModal,
      hideAssignMacroModal,
      assignedMacroModalVisible,
      showDeleteMacroModal,
      hideDeleteMacroModal,
      deleteMacroModalVisible,
      hideAboutModal,
      aboutModalVisible,
      hideDemoModal,
      showDemoModal,
      demoModalVisible,
      assignMacro,
      deleteMacro,
    }),
    [
      currentMacroKeys,
      clearCurrentMacroKeys,
      devices,
      noteHistory,
      macrosByNoteId,
      selectedMacro,
      selectedMidiNote,
      assignedMacroModalVisible,
      deleteMacroModalVisible,
      aboutModalVisible,
      demoModalVisible,
    ],
  );

  return (
    <AppContext.Provider value={contextData}>{children}</AppContext.Provider>
  );
};

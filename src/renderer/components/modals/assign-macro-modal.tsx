import { useContext, useState, useEffect, useCallback } from 'react';
import '../../App.css';
import { Button, Modal, Form, Stack, Tabs, Tab, Alert } from 'react-bootstrap';
import { AppContext } from '../../AppContext';
import {
  MacroAction,
  MacroActionLaunchApp,
  MacroActionOpenFolder,
  MacroActionType,
} from '../../../common/types';
import { DefineActionOpenFolder } from './define-action-open-folder';
import { DefineActionLaunchApp } from './define-action-launch-app';
import { DefineActionTriggerShortcut } from './define-action-trigger-shortcut';

export const AssignMacroModal = () => {
  const {
    selectedMidiNote,
    selectedMacro,
    assignedMacroModalVisible,
    hideAssignMacroModal,
    assignMacro,
  } = useContext(AppContext);

  // Pre-populate options
  const [selectedAction, setSelectedAction] = useState<MacroActionType>(
    selectedMacro?.type || 'Open Folder',
  );
  const [actionsByType, setActionsByType] = useState<
    Partial<Record<MacroActionType, MacroAction>>
  >({});

  useEffect(() => {
    setSaveError('');
    // Wipe out old actions when a new modal opens
    setActionsByType(
      selectedMacro
        ? {
            [selectedMacro.type]: selectedMacro,
          }
        : {},
    );
    setSelectedAction(selectedMacro?.type || 'Open Folder');
  }, [selectedMacro, assignedMacroModalVisible]);

  const [isEditMode, setIsEditMode] = useState(false);
  const [saveError, setSaveError] = useState('');

  const onSetActionData = async (action: MacroAction) => {
    const enhancedAction: MacroAction = {
      ...action,
      midiNote: selectedMidiNote!,
    };

    setActionsByType({ ...actionsByType, [action.type]: enhancedAction });
    setSaveError('');
  };

  const handleSaveAndClose = async () => {
    const action = actionsByType[selectedAction]!;

    // Warn users if we have unsaved changes
    switch (selectedAction) {
      case 'Trigger Shortcut': {
        if (!action || isEditMode) {
          setSaveError(`Click 'Set' to apply your changes`);
          return;
        }
        break;
      }
      case 'Launch App': {
        if (!action || !(action as MacroActionLaunchApp).path) {
          setSaveError('Please select an app to launch');
          return;
        }
        break;
      }
      case 'Open Folder': {
        if (!action || !(action as MacroActionOpenFolder).directory) {
          setSaveError('Please select a folder to open');
          return;
        }
        break;
      }
    }

    await assignMacro(action);

    // Close form
    hideAssignMacroModal();
  };

  return (
    <Modal
      show={!!assignedMacroModalVisible}
      onHide={hideAssignMacroModal}
      centered
      className="modal"
    >
      <Modal.Header closeButton closeVariant="white">
        <Modal.Title>
          {selectedMacro ? 'Edit Macro' : 'Assign Macro'}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Stack gap={3}>
          <div>
            <b>{selectedMidiNote?.name}</b> -
            <b> {selectedMidiNote?.deviceName}</b>
          </div>
          <Tabs
            fill
            justify
            activeKey={selectedAction}
            defaultActiveKey={selectedAction}
            onSelect={(eventKey) => {
              setSelectedAction(eventKey as MacroActionType);
              setSaveError('');
            }}
          >
            <Tab
              eventKey="Open Folder"
              title="Open Folder"
              style={{ padding: '10px' }}
            >
              <DefineActionOpenFolder
                initialAction={selectedMacro}
                onSetActionData={onSetActionData}
                active={selectedAction === 'Open Folder'}
              />
            </Tab>

            <Tab
              eventKey="Launch App"
              title="Launch App"
              style={{ padding: '10px' }}
            >
              <DefineActionLaunchApp
                initialAction={selectedMacro}
                onSetActionData={onSetActionData}
                active={selectedAction === 'Launch App'}
              />
            </Tab>

            <Tab
              eventKey="Trigger Shortcut"
              title="Trigger Shortcut"
              style={{ padding: '10px' }}
            >
              <DefineActionTriggerShortcut
                initialAction={selectedMacro}
                onSetActionData={onSetActionData}
                onEditModeToggled={(editMode: boolean) => {
                  setIsEditMode(editMode);
                }}
                active={selectedAction === 'Trigger Shortcut'}
              />
            </Tab>
          </Tabs>
          {saveError && <Alert variant="danger">{saveError}</Alert>}
        </Stack>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={hideAssignMacroModal}>
          Cancel
        </Button>
        <Button type="submit" onClick={handleSaveAndClose}>
          Assign
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

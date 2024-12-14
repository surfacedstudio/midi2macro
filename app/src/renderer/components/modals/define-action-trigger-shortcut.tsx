import { useContext, useState, useEffect } from 'react';
import '../../App.css';
import { Stack, Badge, Button } from 'react-bootstrap';
import { MacroActionTriggerShortcut, MacroAction } from '../../../common/types';
import { AppContext } from '../../AppContext';

type DefineActionTriggerShortcutProps = {
  initialAction: MacroAction | null;
  onSetActionData: (action: MacroAction) => void;
  onEditModeToggled: (editMode: boolean) => void;
  active: boolean;
};

export const DefineActionTriggerShortcut = ({
  initialAction,
  onSetActionData,
  onEditModeToggled,
  active,
}: DefineActionTriggerShortcutProps) => {
  const [selectedKeys, setSelectedKeys] = useState<string[]>(
    initialAction?.type === 'Trigger Shortcut'
      ? (initialAction as MacroActionTriggerShortcut).keys
      : [],
  );
  const [editMode, setEditMode] = useState(false);
  const { currentMacroKeys, clearCurrentMacroKeys } = useContext(AppContext);

  useEffect(() => {
    onEditModeToggled(editMode);
  }, [editMode]);

  // onSetActionData();
  const getShortcutText = (
    keys: string[],
    defaultText: string = 'No shortcut assigned',
  ) => {
    if (!keys || !keys.length) {
      return <span>{defaultText}</span>;
    }

    return (
      <div>
        Current shortcut:{' '}
        {keys.map((key, index) => (
          <span key={Math.random().toString()}>
            <Badge key={`key-${key}`} style={{ marginRight: '5px' }}>
              {key}
            </Badge>
            {index < keys.length - 1 ? <span>+ </span> : ''}
          </span>
        ))}
      </div>
    );
  };

  return (
    <Stack gap={3}>
      <div>Trigger a keyboard shortcut.</div>
      {editMode ? (
        <div>
          <div>{getShortcutText(currentMacroKeys, '[PRESS A KEY]')}</div>
          <div style={{ marginTop: '20px' }}>
            <Button
              variant="secondary"
              className="setShortcutButton"
              onClick={() => {
                if (currentMacroKeys?.length > 0) {
                  setSelectedKeys(currentMacroKeys);
                }
                onSetActionData({
                  type: 'Trigger Shortcut',
                  keys: currentMacroKeys,
                } as MacroActionTriggerShortcut);
                setEditMode(false);
              }}
            >
              Set
            </Button>
          </div>
        </div>
      ) : (
        <div>
          <div>{getShortcutText(selectedKeys)}</div>
          <div style={{ marginTop: '20px' }}>
            <Button
              variant="secondary"
              onClick={(e) => {
                // Loose focus so Space / Enter don't click the button
                e.currentTarget.blur();
                clearCurrentMacroKeys();
                setEditMode(true);
              }}
            >
              Change
            </Button>
          </div>
        </div>
      )}
    </Stack>
  );
};

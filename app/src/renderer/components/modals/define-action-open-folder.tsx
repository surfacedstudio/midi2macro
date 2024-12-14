import { useState, useEffect } from 'react';
import '../../App.css';
import { Button, Stack } from 'react-bootstrap';
import { MacroActionOpenFolder, MacroAction } from '../../../common/types';
import { ipcClient } from '../../utils/ipc-client';

type DefineActionOpenFolderProps = {
  initialAction: MacroAction | null;
  onSetActionData: (action: MacroAction) => void;
  active: boolean;
};

export const DefineActionOpenFolder = ({
  initialAction,
  onSetActionData,
  active,
}: DefineActionOpenFolderProps) => {
  const [selectedFolder, setSelectedFolder] = useState(
    initialAction?.type === 'Open Folder'
      ? (initialAction as MacroActionOpenFolder).directory
      : '',
  );

  const onSelectFolder = async () => {
    const folder = await ipcClient.selectFolder();
    if (folder) {
      setSelectedFolder(folder);
    }

    await onSetActionData({
      type: 'Open Folder',
      directory: folder,
    } as MacroActionOpenFolder);
  };

  return (
    <Stack gap={3}>
      Open a local folder on your computer.
      <div>Folder: {selectedFolder}</div>
      <div>
        <Button variant="secondary" size="sm" onClick={onSelectFolder}>
          {selectedFolder ? 'Change' : 'Select'}
        </Button>
      </div>
    </Stack>
  );
};

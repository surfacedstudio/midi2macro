import { useState, useEffect } from 'react';
import '../../App.css';
import { Button, Stack } from 'react-bootstrap';
import { MacroAction, MacroActionLaunchApp } from '../../../common/types';
import { ipcClient } from '../../utils/ipc-client';

type DefineActionLaunchAppProps = {
  initialAction: MacroAction | null;
  onSetActionData: (action: MacroAction) => void;
  active: boolean;
};

export const DefineActionLaunchApp = ({
  initialAction,
  onSetActionData,
  active,
}: DefineActionLaunchAppProps) => {
  // Pre-populate options
  const [selectedApp, setSelectedApp] = useState(
    initialAction?.type === 'Launch App'
      ? (initialAction as MacroActionLaunchApp).path
      : '',
  );

  const onSelectApp = async () => {
    const path = await ipcClient.selectApp();
    if (path) {
      setSelectedApp(path);
    }

    await onSetActionData({
      type: 'Launch App',
      path,
    } as MacroActionLaunchApp);
  };

  return (
    <Stack gap={3}>
      <div>Open an application on your computer.</div>
      <div>App: {selectedApp}</div>
      <div>
        <Button variant="secondary" size="sm" onClick={onSelectApp}>
          {selectedApp ? 'Change' : 'Select'}
        </Button>
      </div>
    </Stack>
  );
};

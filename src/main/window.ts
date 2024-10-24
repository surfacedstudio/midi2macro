import path from 'path';
import { BrowserWindow, app, shell, dialog } from 'electron';
import { resolveHtmlPath } from './util';

let mainWindow: BrowserWindow | null = null;

export const getMainWindow = (): BrowserWindow | null => mainWindow;

export const getAssetPath = (...paths: string[]): string => {
  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  return path.join(RESOURCES_PATH, ...paths);
};

export const createMainWindow = (): BrowserWindow => {
  // Don't create twice
  if (mainWindow) {
    return mainWindow;
  }

  mainWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 728,
    transparent: false,
    alwaysOnTop: false,
    // autoHideMenuBar: true,
    frame: true, // !transparent
    icon: getAssetPath('icon.png'),
    //useContentSize: true,
    webPreferences: {
      devTools: true,
      zoomFactor: 1.0,
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
    },
  });

  // // Allow clickthrough~
  // mainWindow.setIgnoreMouseEvents(true, {
  //   forward: true,
  // });

  mainWindow.loadURL(resolveHtmlPath('index.html'));

  // Register keyboard listener
  mainWindow.webContents.removeAllListeners('before-input-event');
  mainWindow.webContents.on('before-input-event', (event, input) => {
    let modifierHash: Record<string, boolean> = input.modifiers.reduce(
      (hash: Record<string, boolean>, item: string) => {
        hash[item.toLowerCase()] = true;
        return hash;
      },
      {},
    );

    if (input.type === 'keyDown') {
      // TODO: currently supports Windows only
      const macroKeys = ['CONTROL', 'SHIFT', 'ALT', 'COMMAND', 'OPTION'].filter(
        (key) => modifierHash[key.toLocaleLowerCase()],
      );

      // Push current key
      if (!modifierHash[input.key.toLocaleLowerCase()]) {
        // Hack to support SPACE and numpad numbers
        const key = input.key.toUpperCase();

        const deShiftedKey = input.shift ? revertShiftKey(key) : undefined;

        // If shift is pressed, the we want the base value of the key instead
        if (deShiftedKey && deShiftedKey !== key) {
          macroKeys.push(deShiftedKey);
        }
        // Remap space
        else if (key === ' ') {
          macroKeys.push('SPACE');
        }
        // Ensure numpad keys are handled differently from normal digits
        else if (modifierHash.iskeypad && !isNaN(key as any)) {
          macroKeys.push(`NUMPAD${key}`);
        }
        // Everything else
        else {
          macroKeys.push(key);
        }
      }

      mainWindow?.webContents.send('key-pressed', macroKeys);
    }
  });

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // Open urls in the user's browser
  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });

  return mainWindow;
};

const revertShiftKey = (key: string): string | undefined => {
  return {
    '!': '1',
    '@': '2',
    '#': '3',
    $: '4',
    '%': '5',
    '^': '6',
    '&': '7',
    '*': '8',
    '(': '9',
    ')': '0',
    _: '-',
    '+': '=',
    '{': '[',
    '}': ']',
    ':': ';',
    '"': "'",
    '<': ',',
    '>': '.',
    '?': '/',
    '~': '`',
    '|': '\\',
  }[key];
};

export const showOpenFileDialog = async (): Promise<string> => {
  if (!mainWindow) {
    return 'ERROR';
  }

  const dir = await dialog.showOpenDialog(mainWindow, {
    properties: ['openDirectory'],
  });

  return dir.filePaths[0];
};

export const showSelectAppDialog = async (): Promise<string> => {
  if (!mainWindow) {
    return 'ERROR';
  }

  const dir = await dialog.showOpenDialog(mainWindow, {
    properties: ['openFile'],
    filters: [
      {
        extensions: ['exe', 'dmg'],
        name: 'Application',
      },
    ],
  });

  return dir.filePaths[0];
};

import { ipcMain, shell } from 'electron';
import { loadMacros, saveMacros } from './macros-server';
import { showOpenFileDialog, showSelectAppDialog } from './window';
import {
  Channels,
  macrosByNoteId,
  MacroAction,
  MacroActionOpenFolder,
  MacroActionLaunchApp,
  MacroActionTriggerShortcut,
} from '../common/types';
import path from 'path';
const child_process = require('child_process');

const { keyboard, Key, clipboard } = require('@nut-tree/nut-js');
keyboard.config.autoDelayMs = 0;

type IpcHandler = (data: any) => Promise<unknown>;
let macrosByNoteId: macrosByNoteId = {};
let currentKeys: string[] = [];

const registerHandler = (channel: Channels, handler: IpcHandler) => {
  ipcMain.on(channel, async (event, arg) => {
    // console.log(
    //   `IPC HANDLER: received ipc event: ${channel}`,
    //   JSON.stringify(arg, null, 2),
    // );

    const output = await handler(arg);

    // console.log(
    //   `IPC HANDLER: responding to renderer: ${channel}`,
    //   JSON.stringify(output, null, 2),
    // );
    event.reply(channel, output);
  });
};

export const registerIpcHandlers = (app: Electron.App) => {
  const appDataPath = app.getPath('appData');
  const macroFile = path.join(appDataPath, 'Midi2Macro', 'macros.json');

  registerHandler('ipc-example', async (input: unknown) => {
    return `IPC test: ${input}-pong`;
  });

  registerHandler('select-folder', async () => {
    const directory = await showOpenFileDialog();
    return directory;
  });

  registerHandler('select-app', async () => {
    const path = await showSelectAppDialog();
    return path;
  });

  registerHandler('open-external-url', async (url: string) => {
    shell.openExternal(url);
  });

  registerHandler('load-macros', async () => {
    macrosByNoteId = loadMacros(macroFile);
    return macrosByNoteId;
  });

  registerHandler('assign-macro', async (action: MacroAction) => {
    macrosByNoteId[action.midiNote.id] = action;
    await saveMacros(macrosByNoteId, macroFile);
  });

  registerHandler('delete-macro', async (action: MacroAction) => {
    delete macrosByNoteId[action.midiNote.id];
    await saveMacros(macrosByNoteId, macroFile);
  });

  registerHandler('execute-macro', async (noteId: string) => {
    const macro = macrosByNoteId[noteId];
    if (!macro) {
      console.warn(`Warning: no macro for noteId ${noteId}`);
      return;
    }

    // $ mplayer foo.mp3
    // player.play(getAssetPath('/sounds/ding.wav'), (error) => {
    //   if (error) {
    //     console.error('FAILED TO PLAY SOUND', error);
    //   }
    // });

    switch (macro.type) {
      case 'Open Folder': {
        child_process.exec(
          `start "" "${(macro as MacroActionOpenFolder).directory}"`,
        );
        break;
      }
      case 'Launch App': {
        child_process.exec(
          `start "" "${(macro as MacroActionLaunchApp).path}"`,
        );
        break;
      }
      case 'Trigger Shortcut': {
        const keys = (macro as MacroActionTriggerShortcut).keys;
        const keyMap: Record<string, string[]> = {
          SHIFT: [Key.LeftShift, Key.RightShift],
          ALT: [Key.LeftAlt, Key.RightAlt],
          CONTROL: [Key.LeftControl, Key.RightControl],
          COMMAND: [Key.LeftCmd, Key.RightCmd],
          OPTION: [Key.LeftAlt, Key.RightAlt],
          WINDOWS: [Key.Windows, Key.Command],
          UP: [Key.Up],
          DOWN: [Key.Down],
          LEFT: [Key.Left],
          RIGHT: [Key.Right],
          TAB: [Key.Tab],
          ENTER: [Key.Enter],
          '.': [Key.Period],
          ',': [Key.Comma],
          '/': [Key.Slash],
          '~': [Key.Grave],
          '[': [Key.LeftBracket],
          ']': [Key.RightBracket],
          '\\': [Key.Backslash],
          '-': [Key.Minus],
          '=': [Key.Equal],
          ';': [Key.Semicolon],
          "'": [Key.Quote],
          RETURN: [Key.Return],
          BACKSPACE: [Key.Backspace],
          ESC: [Key.Escape],
          PRINT: [Key.Print],
          SCROLLLOCK: [Key.ScrollLock],
          PAUSE: [Key.Pause],
          INSERT: [Key.Insert],
          HOME: [Key.Home],
          PAGEUP: [Key.PageUp],
          PAGEDOWN: [Key.PageDown],
          NUMLOCK: [Key.NumLock],
          DIVIDE: [Key.Divide],
          MULTIPLY: [Key.Multiply],
          SUBTRACT: [Key.Subtract],
          DELETE: [Key.Delete],
          END: [Key.End],
          CAPSLOCK: [Key.CapsLock],
          SPACE: [Key.Space], // Handles the name being mapped to 'SPACE' when window detects key down
          ' ': [Key.Space], // Just in case I messed something up and it falls back
          F1: [Key.F1],
          F2: [Key.F2],
          F3: [Key.F3],
          F4: [Key.F4],
          F5: [Key.F5],
          F6: [Key.F6],
          F7: [Key.F7],
          F8: [Key.F8],
          F9: [Key.F9],
          F10: [Key.F10],
          F11: [Key.F11],
          F12: [Key.F12],
          1: [Key.Num1],
          2: [Key.Num2],
          3: [Key.Num3],
          4: [Key.Num4],
          5: [Key.Num5],
          6: [Key.Num6],
          7: [Key.Num7],
          8: [Key.Num8],
          9: [Key.Num9],
          0: [Key.Num0],
          NUMPAD1: [Key.NumPad1],
          NUMPAD2: [Key.NumPad2],
          NUMPAD3: [Key.NumPad3],
          NUMPAD4: [Key.NumPad4],
          NUMPAD5: [Key.NumPad5],
          NUMPAD6: [Key.NumPad6],
          NUMPAD7: [Key.NumPad7],
          NUMPAD8: [Key.NumPad8],
          NUMPAD9: [Key.NumPad9],
          NUMPAD0: [Key.NumPad0],
          NUMPADENTER: [Key.NUMPADENTER],
          A: [Key.A],
          B: [Key.B],
          C: [Key.C],
          D: [Key.D],
          E: [Key.E],
          F: [Key.F],
          G: [Key.G],
          H: [Key.H],
          I: [Key.I],
          J: [Key.J],
          K: [Key.K],
          L: [Key.L],
          M: [Key.M],
          N: [Key.N],
          O: [Key.O],
          P: [Key.P],
          Q: [Key.Q],
          R: [Key.R],
          S: [Key.S],
          T: [Key.T],
          U: [Key.U],
          V: [Key.V],
          W: [Key.W],
          X: [Key.X],
          Y: [Key.Y],
          Z: [Key.Z],

          // TODO - ADD ALL KEYS!
        };

        const keysToTrigger = keys.reduce((items, key) => {
          items = items.concat(...(keyMap[key] || []));
          return items;
        }, []);

        // TODO:
        await keyboard.pressKey(...keysToTrigger);
        await keyboard.releaseKey(...keysToTrigger);

        // https://nut-tree.github.io/apidoc/enums/_nut_tree_shared.Key.html#LeftWin
        // await keyboard.pressKey(Key.LeftControl, Key.V);
        // await keyboard.releaseKey(Key.LeftControl, Key.V);
        break;
      }
      default: {
        console.error(`Error: unknown macro action type ${macro.type}`);
      }
    }
  });
};

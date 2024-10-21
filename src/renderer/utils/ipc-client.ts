import {
  Channels,
  macrosByNoteId,
  InputHandler,
  MacroAction,
} from '../../common/types';

const registerHandler =
  <T, K>(channel: Channels) =>
  (input?: T): Promise<K> => {
    return new Promise((resolve, reject) => {
      window.electron.ipcRenderer.once(channel, (output) => {
        // console.log(
        //   `IPC CLIENT: received response from ipc ${channel}`,
        //   output,
        // );
        resolve(output as K);
      });
      // console.log(`IPC CLIENT: sending message to ipc ${channel}`, input);
      window.electron.ipcRenderer.sendMessage(channel, input || null);
    });
  };

class IpcClient {
  loadMacros = registerHandler<void, macrosByNoteId>('load-macros');
  assignMacro = registerHandler<MacroAction, macrosByNoteId>('assign-macro');
  executeMacro = registerHandler<string, void>('execute-macro');
  deleteMacro = registerHandler<MacroAction, macrosByNoteId>('delete-macro');
  selectFolder = registerHandler<void, string>('select-folder');
  selectApp = registerHandler<void, string>('select-app');
  openExternalUrl = registerHandler<string, void>('open-external-url');
  registerKeyListener = async (handler: (currentKeys: string[]) => void) => {
    window.electron.ipcRenderer.on('key-pressed', handler as any);
  };
  registerMenuListener = async (handler: (event: string) => void) => {
    window.electron.ipcRenderer.on('menu-event', handler as any);
  };
}

export const ipcClient = new IpcClient();

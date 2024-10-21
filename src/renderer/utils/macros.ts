import {
  MacroAction,
  MacroActionLaunchApp,
  MacroActionOpenFolder,
  MacroActionTriggerShortcut,
} from '../../common/types';

export const getTooltip = (macro: MacroAction) => {
  switch (macro.type) {
    case 'Launch App':
      return (macro as MacroActionLaunchApp).path;
    case 'Open Folder':
      return (macro as MacroActionOpenFolder).directory;
    case 'Trigger Shortcut':
      return (macro as MacroActionTriggerShortcut).keys.join(' + ');
    default:
      return '';
  }
};

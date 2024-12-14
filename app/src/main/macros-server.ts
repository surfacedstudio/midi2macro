import fs from 'fs';
import { macrosByNoteId } from '../common/types';

export const loadMacros = (file: string): macrosByNoteId => {
  if (fs.existsSync(file)) {
    try {
      const rawData = fs.readFileSync(file, 'utf-8');
      return (JSON.parse(rawData) as macrosByNoteId) || {};
    } catch (error) {
      console.error('Failed to load macros from file', error);
      return {};
    }
  }
  return {};
};

export const saveMacros = (macros: macrosByNoteId, file: string): any => {
  try {
    fs.writeFileSync(file, JSON.stringify(macros));
  } catch (error) {
    console.error('Failed to save macros to file', error);
    return error;
  }
};

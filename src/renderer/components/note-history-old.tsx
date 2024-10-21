import { useContext } from 'react';
import '../App.css';
import { MidiDevice } from '../../common/types';
import { Stack, Button, Card } from 'react-bootstrap';
import { AppContext } from '../AppContext';

type NoteHistoryProps = {
  device: MidiDevice;
};

export const NoteHistory = ({ device }: NoteHistoryProps) => {
  const {
    noteHistory,
    showAssignMacroModal,
    showDeleteMacroModal,
    macrosByNoteId,
  } = useContext(AppContext);

  const notes = noteHistory.filter((n) => n.deviceId === device.id).slice(0, 5);

  return (
    <Stack gap={0}>
      <div
        style={{
          padding: '15px 20px',
          backgroundColor: 'white',
          borderRadius: '5px',
        }}
      >
        {notes.length
          ? `Last ${notes.length} Notes${notes.length === 5 ? ' (MAX)' : ''}`
          : `0 Notes Received. Press a note 🎵`}
      </div>
      {notes.map((note) => {
        const macro = macrosByNoteId[note.id];

        return (
          <Card
            className="redHighlightAnimation"
            style={{ marginTop: '-1px' }}
            key={note.eventTime}
          >
            <Card.Body>
              <div style={{ float: 'left', display: 'flex' }}>
                <div style={{ width: '50px' }}>{note.name}</div>
                <div>{macro?.type}</div>
              </div>
              <div style={{ float: 'right' }}>
                <Button
                  variant={macro ? 'primary' : 'secondary'}
                  size="sm"
                  onClick={() => showAssignMacroModal(note, macro)}
                >
                  {macro?.type || 'No Macro'}
                </Button>
                {macro ? (
                  <Button
                    style={{ marginLeft: '10px' }}
                    variant={macro ? 'primary' : 'secondary'}
                    size="sm"
                    onClick={() => showDeleteMacroModal(macro)}
                  >
                    Delete macro
                  </Button>
                ) : (
                  ''
                )}
              </div>
            </Card.Body>
          </Card>
        );
      })}
    </Stack>
  );
};

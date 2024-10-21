import { useContext } from 'react';
import '../App.css';
import { MidiDevice } from '../../common/types';
import {
  Container,
  Button,
  Row,
  Col,
  Accordion,
  AccordionItem,
  AccordionHeader,
  AccordionBody,
  OverlayTrigger,
  Tooltip,
  Badge,
  Stack,
} from 'react-bootstrap';
import { AppContext } from '../AppContext';
import { getTooltip } from '../utils/macros';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMusic } from '@fortawesome/free-solid-svg-icons';

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

  const allNotes = noteHistory.filter((n) => n.deviceId === device.id);
  const notes = allNotes.slice(0, 5);

  return (
    <Accordion defaultActiveKey="0" className="detailAccordion">
      <AccordionItem eventKey="0">
        <AccordionHeader>
          {notes.length ? (
            `Last ${notes.length} Notes${notes.length === 5 ? ' (MAX)' : ''}`
          ) : (
            <span>
              0 Notes Received. Press a note
              <FontAwesomeIcon icon={faMusic} style={{ marginLeft: '10px' }} />
            </span>
          )}
        </AccordionHeader>
        <AccordionBody>
          <Container fluid>
            {notes.map((note) => {
              const macro = macrosByNoteId[note.id];

              return (
                <Row
                  className="redHighlightAnimation"
                  style={{
                    marginTop: '-1px',
                    marginBottom: '5px',
                    padding: '3px',
                    borderRadius: '3px',
                  }}
                  key={note.eventTime}
                >
                  <Col xs={1} style={{ whiteSpace: 'nowrap' }}>
                    {note.name}
                  </Col>
                  <Col>
                    {macro ? (
                      <div style={{ display: 'flex' }}>
                        <Stack gap={1}>
                          <div>{macro.type}</div>
                          <div
                            style={{
                              fontSize: '0.6em',
                            }}
                          >
                            {getTooltip(macro)}
                          </div>
                        </Stack>
                        {/* <OverlayTrigger
                          overlay={<Tooltip>{getTooltip(macro)}</Tooltip>}
                        >
                          <Badge
                            pill
                            bg="secondary"
                            style={{ marginLeft: '5px' }}
                          >
                            ?
                          </Badge>
                        </OverlayTrigger> */}
                      </div>
                    ) : (
                      ''
                    )}
                  </Col>
                  <Col style={{ textAlign: 'right' }}>
                    <Button
                      variant={macro ? 'primary' : 'secondary'}
                      size="sm"
                      onClick={() => showAssignMacroModal(note, macro)}
                    >
                      {macro ? 'Edit Macro' : 'Assign Macro'}
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
                  </Col>
                </Row>
              );
            })}
            {allNotes.length > 5 ? (
              <Row>
                <Col>...</Col>
              </Row>
            ) : (
              ''
            )}
          </Container>
        </AccordionBody>
      </AccordionItem>
    </Accordion>
  );
};

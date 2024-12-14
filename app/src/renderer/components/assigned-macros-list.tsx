import { useContext } from 'react';
import '../App.css';
import { MidiDevice } from '../../common/types';
import {
  Container,
  Row,
  Col,
  Button,
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

type AssignedMacrosListProps = {
  device: MidiDevice;
};

export const AssignedMacrosList = ({ device }: AssignedMacrosListProps) => {
  const { macrosByNoteId, showAssignMacroModal, showDeleteMacroModal } =
    useContext(AppContext);

  const noteIds = Object.keys(macrosByNoteId).filter((noteId) =>
    noteId.startsWith(device.id),
  );

  return (
    <Accordion className="detailAccordion">
      <AccordionItem eventKey="0">
        <AccordionHeader>{noteIds.length} Existing Macros</AccordionHeader>
        <AccordionBody>
          <Container fluid>
            {noteIds.map((noteId) => {
              const macro = macrosByNoteId[noteId];
              return (
                <Row
                  key={Math.random().toString()}
                  style={{ marginBottom: '5px' }}
                >
                  <Col xs={1} style={{ whiteSpace: 'nowrap' }}>
                    {noteId.split('-').pop()}
                  </Col>
                  <Col>
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
                  </Col>
                  <Col style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => showDeleteMacroModal(macro)}
                    >
                      Delete Macro
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() =>
                        showAssignMacroModal(macro.midiNote, macro)
                      }
                      style={{ marginLeft: '10px' }}
                    >
                      Edit Macro
                    </Button>
                  </Col>
                </Row>
              );
            })}
          </Container>
        </AccordionBody>
      </AccordionItem>
    </Accordion>
  );
};

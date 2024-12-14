import { useContext } from 'react';
import '../../App.css';
import { Button, Modal, Form } from 'react-bootstrap';
import { AppContext } from '../../AppContext';

export const DeleteMacroModal = () => {
  const {
    selectedMacro,
    deleteMacroModalVisible,
    hideDeleteMacroModal,
    deleteMacro,
  } = useContext(AppContext);

  const handleSubmit = async (event) => {
    event.preventDefault(); // Don't reload page
    if (selectedMacro) {
      await deleteMacro(selectedMacro);
    }
    hideDeleteMacroModal();
  };

  return (
    <Modal
      show={deleteMacroModalVisible}
      onHide={hideDeleteMacroModal}
      centered
      className="modal"
    >
      <Form onSubmit={handleSubmit}>
        <Modal.Header closeButton closeVariant="white">
          <Modal.Title>Confirm Delete Macro</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete the macro for{' '}
          <b>{selectedMacro?.midiNote.name}</b> on
          <b> {selectedMacro?.midiNote.deviceName}</b>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={hideDeleteMacroModal}>
            Cancel
          </Button>
          <Button type="submit">Delete</Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

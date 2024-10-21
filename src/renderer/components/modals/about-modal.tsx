import { useContext } from 'react';
import '../../App.css';
import { Button, Modal, Stack } from 'react-bootstrap';
import { AppContext } from '../../AppContext';
import { ipcClient } from '../../utils/ipc-client';
import { APP_TITLE, WEBSITE_URL } from '../../../common/globals';

export const AboutModal = () => {
  const { aboutModalVisible, hideAboutModal } = useContext(AppContext);

  return (
    <Modal
      show={!!aboutModalVisible}
      onHide={hideAboutModal}
      centered
      className="modal"
    >
      <Modal.Body style={{ margin: '20px 0' }}>
        <Stack style={{ alignItems: 'center' }} gap={3}>
          <h2>{APP_TITLE}</h2>
          <Button onClick={() => ipcClient.openExternalUrl(WEBSITE_URL)}>
            Official Website
          </Button>
          <div>Copyright © {new Date().getFullYear()} Surfaced Studio</div>
          <Button
            variant="secondary"
            onClick={hideAboutModal}
            style={{ minWidth: '100px' }}
          >
            OK
          </Button>
        </Stack>
      </Modal.Body>
    </Modal>
  );
};

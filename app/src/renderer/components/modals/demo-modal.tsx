import { useContext } from 'react';
import '../../App.css';
import { Button, Modal, Stack } from 'react-bootstrap';
import { AppContext } from '../../AppContext';
import { ipcClient } from '../../utils/ipc-client';
import { APP_TITLE, SHOP_URL } from '../../../common/globals';

export const DemoModal = () => {
  const { demoModalVisible, hideDemoModal } = useContext(AppContext);

  return (
    <Modal
      show={!!demoModalVisible}
      onHide={hideDemoModal}
      centered
      className="modal"
    >
      <Modal.Header closeButton closeVariant="white" />
      <Modal.Body style={{ margin: '20px 0' }}>
        <Stack style={{ alignItems: 'center', textAlign: 'center' }} gap={3}>
          <h2>Please consider upgrading 🎹</h2>
          <p>
            This demo version is limited to 5 macros max.
            <br />
            You can purchase the full version from our shop 🙂
            <Button
              onClick={() => ipcClient.openExternalUrl(SHOP_URL)}
              style={{ marginTop: '40px' }}
            >
              Visit Shop
            </Button>
          </p>
        </Stack>
      </Modal.Body>
    </Modal>
  );
};

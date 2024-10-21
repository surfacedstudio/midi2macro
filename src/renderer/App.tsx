import { useState, useContext, useEffect } from 'react';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import { MidiDevice, MidiNote } from '../common/types';
import { ManageDevice } from './components/manage-device';
import { DeviceList } from './components/device-list';
import { AssignMacroModal } from './components/modals/assign-macro-modal';
import { DeleteMacroModal } from './components/modals/delete-macro-modal';
import { Footer } from './components/footer';
import { AppContextProvider, AppContext } from './AppContext';
import { Stack } from 'react-bootstrap';
import { AboutModal } from './components/modals/about-modal';
import { MainNavbar } from './components/main-navbar';
import { DemoModal } from './components/modals/demo-modal';
import { IS_DEMO } from '../common/globals';

const Content = () => {
  const [selectedDevice, setSelectedDevice] = useState<MidiDevice | null>();
  const [selectedNote] = useState<MidiNote | null>(null);
  const { showDemoModal } = useContext(AppContext);

  useEffect(() => {
    if (IS_DEMO) {
      showDemoModal();
    }
  }, []);

  if (selectedDevice) {
    return (
      <div>
        {/* <MainNavbar /> */}
        <div className="pageWrapper">
          <Stack gap={3}>
            <ManageDevice
              device={selectedDevice}
              note={selectedNote}
              handleReturn={() => setSelectedDevice(null)}
            />
          </Stack>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* <MainNavbar /> */}
      <div className="pageWrapper">
        <Stack gap={3}>
          <DeviceList
            handleSelect={(device: MidiDevice) => setSelectedDevice(device)}
          />
        </Stack>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <AppContextProvider>
              <AssignMacroModal />
              <DeleteMacroModal />
              <AboutModal />
              <DemoModal />
              <Content />
              <Footer />
            </AppContextProvider>
          }
        />
      </Routes>
    </Router>
  );
}

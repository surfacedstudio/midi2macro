import { Container, Navbar, Nav, NavDropdown } from 'react-bootstrap';
import '../App.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCoffee } from '@fortawesome/free-solid-svg-icons';

export const MainNavbar = () => {
  return (
    <Navbar className="bg-body-tertiary" style={{ height: '30px' }}>
      <Container style={{ paddingLeft: '10px', marginLeft: '10px' }}>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar id="basic-navbar-nav">
          <Nav className="me-auto">
            <NavDropdown title="File" id="basic-nav-dropdown">
              <NavDropdown.Item href="#action/3.1">Exit</NavDropdown.Item>
            </NavDropdown>
            <NavDropdown title="Help" id="basic-nav-dropdown">
              <NavDropdown.Item href="#action/3.1">
                Documentation <FontAwesomeIcon icon={faCoffee} />
              </NavDropdown.Item>
              <NavDropdown.Item href="#action/3.2">About</NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar>
      </Container>
    </Navbar>
  );
};

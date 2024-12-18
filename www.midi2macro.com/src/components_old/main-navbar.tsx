import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import "./main-navbar.scss";

export const MainNavbar = () => {
  return (
    <Navbar expand="lg" className="mainNav" variant="dark">
      <Container>
        <Navbar.Brand href="/">Home</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <NavDropdown title="Midi2Macro" id="basic-nav-dropdown">
              <NavDropdown.Item href="/midi2macro">Overview</NavDropdown.Item>
              <NavDropdown.Item href="/midi2macro/manual">
                Manual
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
          <Nav.Link href="/contact">Contact</Nav.Link>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

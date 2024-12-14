import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import "./footer.scss";

export const Footer = () => {
  return (
    <div className="footer">
      Copyright © {new Date().getFullYear()} Cats In Tech
      <div className="footnote">
        Powered by{" "}
        <a href="https://www.surfacedstudio.com" target="_blank">
          Surfaced Studio
        </a>
      </div>
    </div>
  );
};

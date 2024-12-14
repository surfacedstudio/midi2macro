import { Container } from 'react-bootstrap';
import '../App.css';
import { APP_TITLE } from '../../common/globals';

export const Footer = () => {
  return (
    <Container
      fluid
      style={{ textAlign: 'center', color: '#aaaaaa', padding: '50px 0' }}
    >
      <div>{APP_TITLE}</div>
      <div style={{ fontSize: '0.8em' }}>
        Copyright © {new Date().getFullYear()} Surfaced Studio
      </div>
    </Container>
  );
};

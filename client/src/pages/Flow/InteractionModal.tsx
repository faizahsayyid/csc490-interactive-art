// InteractionModal.tsx
import React from 'react';
import { Modal, Button } from 'react-bootstrap';

interface InteractionModalProps {
  showModal: boolean;
  onHide: () => void;
  onConfirm: () => void;
}

const InteractionModal: React.FC<InteractionModalProps> = ({ showModal, onHide, onConfirm }) => {
  return (
    <Modal show={showModal} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Define Interaction</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Define the interaction for the devices here.</p>
        {/* Additional form elements or content can be added here */}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={onConfirm}>
          Confirm
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default InteractionModal;

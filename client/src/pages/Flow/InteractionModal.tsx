// InteractionModal.tsx
import React from "react";
import { Modal, Button } from "react-bootstrap";

interface InteractionModalProps {
  showModal: boolean;
  onHide: () => void;
  onConfirm: () => void;
  sourceDevice: any;
  targetDevice: any;
}

const InteractionModal: React.FC<InteractionModalProps> = ({
  showModal,
  onHide,
  onConfirm,
  sourceDevice,
  targetDevice,
}) => {
  if (!sourceDevice || !targetDevice) {
    return null;
  }

  return (
    <Modal show={showModal} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Define Interaction</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>{`Source Device: ${sourceDevice.data.name}, Target Device: ${targetDevice.data.name}`}</p>
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

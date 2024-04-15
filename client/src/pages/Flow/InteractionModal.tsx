// InteractionModal.tsx
import React, { useEffect, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import axios from "axios";

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
  const [allowedActions, setAllowedActions] = useState<string[]>([]);
  const [selectedAction, setSelectedAction] = useState<string>("[select]");
  const [actionParameters, setActionParameters] = useState<any>({});

  useEffect(() => {
    if (showModal) {
      const requestBody = {
        input_device: sourceDevice.data.name.replace(" ", "_").toLowerCase(),
        output_device: targetDevice.data.name.replace(" ", "_").toLowerCase(),
      };

      axios
        .post("http://127.0.0.1:8000/arduino/actions/", requestBody)
        .then((response) => {
          console.log("Response:", response.data);
          setAllowedActions(response.data);
        })
        .catch((error) => {
          console.error("Error in axios post:", error);
        });
    }
  }, [showModal]);

  return (
    <Modal show={showModal} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>
          Define Interaction between{" "}
          {`${sourceDevice.data.name} and ${targetDevice.data.name}`}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          {allowedActions && (
            <Form.Group controlId="deviceTypeSelect" className="mb-2">
              <Form.Label>Select Interaction</Form.Label>
              <Form.Control
                as="select"
                value={selectedAction}
                onChange={(event: any) => setSelectedAction(event.target.value)}
              >
                <option value="[select]">[select]</option>
                {allowedActions.map((action, index) => (
                  <option key={index}>{action}</option>
                ))}
              </Form.Control>
            </Form.Group>
          )}
          {selectedAction !== "[select]" && (
            <Form.Group controlId="deviceTypeSelect" className="mb-2">
              <Form.Label>Define Parameters</Form.Label>
            </Form.Group>
          )}
        </Form>
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

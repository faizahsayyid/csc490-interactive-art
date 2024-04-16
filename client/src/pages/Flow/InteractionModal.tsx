// InteractionModal.tsx
import React, { useEffect, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import axios from "axios";

interface InteractionModalProps {
  showModal: boolean;
  onHide: () => void;
  onConfirm: (sourceDevice: Node,
    targetDevice: Node,
    action_key: string,
    args: any[]) => void;
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
  const [parameterValues, setParameterValues] = useState<Record<string, any>>({});

  useEffect(() => {
    setSelectedAction("[select]");
    setActionParameters({});
    setParameterValues({});
  }, [showModal]);

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

  useEffect(() => {
    if (selectedAction !== "[select]") {
      const requestBody = {
        action_key: selectedAction,
      };

      axios
        .post("http://127.0.0.1:8000/arduino/action-params/", requestBody)
        .then((response) => {
          console.log("Response:", response.data);
          setActionParameters(response.data);
        })
        .catch((error) => {
          console.error("Error in axios post:", error);
        });
    }
  }, [selectedAction]);

  const handleParameterValueChange = (param: string, value: string) => {
    const newValue = parseInt(value, 10);
    setParameterValues(prev => ({
      ...prev,
      [param]: newValue
    }));
  };

  const handleConfirm = () => {
    if (selectedAction !== "[select]") {
      const args = Object.keys(actionParameters).map(key => parameterValues[key]);
      onConfirm(sourceDevice, targetDevice, selectedAction, args);
    } else {
      alert("Select an interaction before confirming.");
    }
  };

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
          {selectedAction !== "[select]" && Object.entries(actionParameters).map(([param, type]) => (
            <Form.Group controlId={`param-${param}`} key={param} className="mb-2">
              <Form.Label>{param} ({`${type}`})</Form.Label>
              <Form.Control
                type="number"
                value={parameterValues[param]}
                onChange={(e) => handleParameterValueChange(param, e.target.value)}
              />
            </Form.Group>
          ))}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
        <Button variant="primary" onClick={handleConfirm}>
          Confirm
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default InteractionModal;

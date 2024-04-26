// InteractionModal.tsx
import React, { useEffect, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import axios from "axios";
import { ActionVariable, ActionVariableType } from "../../types/action";
import { ACTION_TO_DESCRIPTION, ACTION_TO_NAME, INTERACTION_COLOR_MAP, ARGS_TO_DESCRIPTION } from "./Constants";

interface InteractionModalProps {
  showModal: boolean;
  onHide: () => void;
  onConfirm: (
    id: string,
    sourceDevice: Node,
    targetDevice: Node,
    action: ActionVariable,
    args: Record<string, any>
  ) => void;
  id: string | null;
  sourceDevice: any;
  targetDevice: any;
}

const InteractionModal: React.FC<InteractionModalProps> = ({
  showModal,
  onHide,
  onConfirm,
  id,
  sourceDevice,
  targetDevice,
}) => {
  if (!sourceDevice || !targetDevice) {
    return null;
  }
  const [allowedActions, setAllowedActions] = useState<string[]>([]);
  const [selectedAction, setSelectedAction] = useState<ActionVariable>({name: "[select]", type: "boolean", description: ""});
  const [actionParameters, setActionParameters] = useState<ActionVariable[]>(
    []
  );
  const [parameterValues, setParameterValues] = useState<Record<string, any>>(
    {}
  );

  useEffect(() => {
    setSelectedAction({name: "[select]", type: "boolean", description: ""});
    setActionParameters([]);
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
          console.log("Response actions:", response.data);
          setAllowedActions(response.data);
        })
        .catch((error) => {
          console.error("Error in axios post:", error);
        });
    }
  }, [showModal]);

  useEffect(() => {
    if (selectedAction.name !== "[select]") {
      const requestBody = {
        action_key: selectedAction,
      };

      axios
        .post("http://127.0.0.1:8000/arduino/action-params/", requestBody)
        .then((response) => {
          console.log("Response:", response.data);
          let ActionVariables: ActionVariable[] = [];
          for (const key in response.data) {
            const actionType: ActionVariableType = response.data[key];
            ActionVariables.push({
              name: key,
              type: actionType,
              description: "",
            });
          }
          setActionParameters(ActionVariables);
        })
        .catch((error) => {
          console.error("Error in axios post:", error);
        });
    }
  }, [selectedAction]);

  const handleParameterValueChange = (param: string, value: string) => {
    const newValue = parseInt(value, 10);
    setParameterValues((prev) => ({
      ...prev,
      [param]: newValue,
    }));
  };

  const handleConfirm = () => {
    if (selectedAction.name !== "[select]") {
      console.log("Args:", parameterValues);
      if (id) {
        onConfirm(id, sourceDevice, targetDevice, selectedAction, parameterValues);
      } else {
        alert("Error: Interaction ID not provided.");
      }
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
                value={selectedAction.name}
                onChange={(event: any) => setSelectedAction(event.target.value)}
              >
                <option value="[select]">[select]</option>
                {allowedActions.map((action, index) => (
                  // @ts-ignore
                  <option key={index} value={action}>{ACTION_TO_NAME[action]}</option>
                ))}
              </Form.Control>
              {/* @ts-ignore */}
              <span style={{color: `${INTERACTION_COLOR_MAP[selectedAction]}`}}>{selectedAction.name !== "[select]" && ACTION_TO_DESCRIPTION[selectedAction]}</span>
            </Form.Group>
          )}
          {selectedAction.name !== "[select]" &&
            actionParameters.map((action) => (
              <Form.Group
                controlId={`param-${action.name}`}
                key={action.name}
                className="mb-2"
              >
                <Form.Label>
                  {/* @ts-ignore */}
                  {ARGS_TO_DESCRIPTION[action.name]} ({`${action.type}`})
                </Form.Label>
                <Form.Control
                  type={action.type}
                  value={parameterValues[action.name]}
                  onChange={(e) =>
                    handleParameterValueChange(action.name, e.target.value)
                  }
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

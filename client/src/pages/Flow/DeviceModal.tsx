import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { INPUT_DEVICE_INFO } from "../../constants/device/input-device";
import { OUTPUT_DEVICE_INFO } from "../../constants/device/output-device";
import { DeviceInfo } from "../../types/device/device";

interface DeviceModalProps {
  showModal: boolean;
  toggleModal: () => void;
  onAddDevice: (deviceType: string, device: DeviceInfo) => void;
}

const DeviceModal: React.FC<DeviceModalProps> = ({
  showModal,
  toggleModal,
  onAddDevice,
}) => {
  const [deviceType, setDeviceType] = useState<"input" | "output" | "[select]">(
    "[select]"
  ); // 'input' or 'output'
  const [selectedDevice, setSelectedDevice] = useState("");
  const deviceInfo =
    deviceType === "input" ? INPUT_DEVICE_INFO : OUTPUT_DEVICE_INFO;

  const returnDevice =
    selectedDevice && Object.hasOwnProperty.call(deviceInfo, selectedDevice)
      ? deviceInfo[selectedDevice as keyof typeof deviceInfo]
      : null;

  const handleDeviceTypeChange = (event: any) => {
    setDeviceType(event.target.value);
    setSelectedDevice("");
  };

  const handleDeviceChange = (event: any) => {
    setSelectedDevice(event.target.value);
  };

  useEffect(() => {
    if (showModal) {
      setDeviceType("[select]");
      setSelectedDevice("");
    }
  }, [showModal]);

  return (
    <Modal show={showModal} onHide={toggleModal} centered>
      <Modal.Header closeButton>
        <Modal.Title>Add New Device</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="deviceTypeSelect" className="mb-2">
            <Form.Label>Device Type</Form.Label>
            <Form.Control
              as="select"
              value={deviceType}
              onChange={handleDeviceTypeChange}
            >
              <option value="[select]">[select]</option>
              <option value="input">Input Device</option>
              <option value="output">Output Device</option>
            </Form.Control>
          </Form.Group>
          {deviceType !== "[select]" && (
            <Form.Group controlId="deviceSelect">
              <Form.Label>
                {deviceType === "input" ? "Input" : "Output"} Device
              </Form.Label>
              <Form.Control
                as="select"
                value={selectedDevice}
                onChange={handleDeviceChange}
              >
                <option value="">Select a Device</option>
                {Object.entries(deviceInfo).map(([deviceKey, { name }]) => (
                  <option key={deviceKey} value={deviceKey}>
                    {name}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
          )}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={toggleModal}>
          Cancel
        </Button>
        <Button
          variant="primary"
          onClick={() => {
            if (!returnDevice || !selectedDevice) {
              return;
            }
            onAddDevice(deviceType, returnDevice); // Implement saving logic here
            toggleModal();
          }}
        >
          Add
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DeviceModal;

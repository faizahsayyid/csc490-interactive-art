import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { INPUT_DEVICE_INFO } from "../../constants/device/input-device";
import {  OUTPUT_DEVICE_INFO } from "../../constants/device/output-device";

interface DeviceModalProps {
  showModal: boolean;
  toggleModal: () => void;
  onAddDevice: (deviceType: string, device: string) => void;
}

const DeviceModal: React.FC<DeviceModalProps> = ({ showModal, toggleModal, onAddDevice }) => {
  const [deviceType, setDeviceType] = useState('input'); // 'input' or 'output'
  const [selectedDevice, setSelectedDevice] = useState('');

  const handleDeviceTypeChange = (event: any) => {
    setDeviceType(event.target.value);
    setSelectedDevice(''); // Reset device selection when type changes
  };

  const handleDeviceChange = (event: any) => {
    setSelectedDevice(event.target.value);
  };

  const deviceInfo = deviceType === 'input' ? INPUT_DEVICE_INFO : OUTPUT_DEVICE_INFO;

  return (
    <Modal show={showModal} onHide={toggleModal} centered>
      <Modal.Header closeButton>
        <Modal.Title>Add New Device</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="deviceTypeSelect">
            <Form.Label>Device Type</Form.Label>
            <Form.Control as="select" value={deviceType} onChange={handleDeviceTypeChange}>
              <option value="input">Input Device</option>
              <option value="output">Output Device</option>
            </Form.Control>
          </Form.Group>
          <Form.Group controlId="deviceSelect">
            <Form.Label>{deviceType === 'input' ? 'Input' : 'Output'} Device</Form.Label>
            <Form.Control as="select" value={selectedDevice} onChange={handleDeviceChange}>
              <option value="">Select a Device</option>
              {Object.entries(deviceInfo).map(([deviceKey, { name }]) => (
                <option key={deviceKey} value={deviceKey}>
                  {name}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={toggleModal}>
          Close
        </Button>
        <Button variant="primary" onClick={() => {
          console.log('Selected Device:', selectedDevice); // Implement saving logic here
          toggleModal();
        }}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DeviceModal;

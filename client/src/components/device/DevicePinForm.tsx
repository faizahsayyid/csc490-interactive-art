import React from "react";
import {
  INPUT_DEVICE_IMAGES,
  INPUT_DEVICE_INFO,
} from "../../constants/device/input-device";
import {
  OUTPUT_DEVICE_IMAGES,
  OUTPUT_DEVICE_INFO,
} from "../../constants/device/output-device";
import { InputDevice } from "../../types/device/input-device";
import { OutputDevice } from "../../types/device/output-device";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateInputDevice, updateOutputDevice } from "../../api/device";

type DevicePinFormProps = {
  imageSrc: string;
  description: string;
  name: string;
  defaultPin?: number;
  onUpdatePin: (pin: number) => void;
};

type InputDevicePinFormProps = {
  deviceId: string;
  inputDevice: InputDevice;
  pin?: number;
  projectId: string;
};

type OutputDevicePinFormProps = {
  projectId: string;
  deviceId: string;
  outputDevice: OutputDevice;
  pin?: number;
};

const DevicePinForm: React.FC<DevicePinFormProps> = ({
  imageSrc,
  description,
  name,
  defaultPin,
  onUpdatePin,
}) => {
  const handleUpdatePin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const pin = parseInt(formData.get("pin") as string);
    onUpdatePin(pin);
  };

  return (
    <div className="d-flex flex-column flex-md-row align-items-center gap-3 px-5 py-3">
      <div className="d-flex align-items-center gap-3">
        <img
          className="rounded"
          height={75}
          src={imageSrc}
          alt="Motion Sensor"
        />
        <div>
          <p className="form-check-label m-0 p-0">{name}</p>
          <small className="form-text text-muted">{description}</small>
        </div>
      </div>
      <form className="ms-md-auto" onSubmit={handleUpdatePin}>
        <label className="form-label d-block m-0" htmlFor="pin">
          Pin Number:
        </label>
        <div className="d-flex gap-3">
          <input
            className="form-control"
            type="number"
            name="pin"
            id="pin"
            min={2}
            max={13}
            defaultValue={defaultPin}
          />
          <button className="btn btn-secondary" type="submit">
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export const InputDevicePinForm: React.FC<InputDevicePinFormProps> = ({
  projectId,
  deviceId,
  inputDevice,
  pin,
}) => {
  const queryClient = useQueryClient();
  const updateInputDeviceMutation = useMutation({
    mutationFn: updateInputDevice,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["getProjectById", projectId],
      });
    },
  });

  const onUpdatePin = (newPin: number) => {
    updateInputDeviceMutation.mutate({
      projectId,
      deviceId,
      deviceName: inputDevice,
      pin: newPin,
    });
  };

  return (
    <DevicePinForm
      imageSrc={INPUT_DEVICE_IMAGES[inputDevice]}
      description={INPUT_DEVICE_INFO[inputDevice].description}
      name={INPUT_DEVICE_INFO[inputDevice].name}
      defaultPin={pin}
      onUpdatePin={onUpdatePin}
    />
  );
};

export const OutputDevicePinForm: React.FC<OutputDevicePinFormProps> = ({
  projectId,
  deviceId,
  outputDevice,
  pin,
}) => {
  const queryClient = useQueryClient();
  const updateInputDeviceMutation = useMutation({
    mutationFn: updateOutputDevice,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["getProjectById", projectId],
      });
    },
  });

  const onUpdatePin = (newPin: number) => {
    updateInputDeviceMutation.mutate({
      projectId,
      deviceId,
      deviceName: outputDevice,
      pin: newPin,
    });
  };
  return (
    <DevicePinForm
      imageSrc={OUTPUT_DEVICE_IMAGES[outputDevice]}
      description={OUTPUT_DEVICE_INFO[outputDevice].description}
      name={OUTPUT_DEVICE_INFO[outputDevice].name}
      defaultPin={pin}
      onUpdatePin={onUpdatePin}
    />
  );
};

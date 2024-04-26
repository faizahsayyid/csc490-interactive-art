import React, { useRef, useState } from "react";
import { Modal } from "react-bootstrap";
import { useMutation } from "@tanstack/react-query";
import { createProject } from "../../api/project";
import { useNavigate } from "react-router-dom";
import { Project } from "../../types/project";
import { AxiosResponse } from "axios";

type CreateProjectModalProps = {
  showModal: boolean;
  onClose: () => void;
};

export const CreateProjectModal: React.FC<CreateProjectModalProps> = ({
  showModal,
  onClose,
}) => {
  const formRef = useRef<HTMLFormElement | null>(null);
  const [validationMessage, setValidationMessage] = useState<string | null>(
    null
  );
  const createProjectMutation = useMutation<
    AxiosResponse<Project>,
    unknown,
    Partial<Project>
  >({
    mutationFn: createProject,
    onSuccess: (res) => {
      const project = res.data;
      onClose();
      navigate(`/project/${project.id}`);
    },
  });
  const navigate = useNavigate();

  const onSubmit = async () => {
    if (!formRef.current) {
      return;
    }
    const formData = new FormData(formRef.current);
    const name = formData.get("name") as string | null;

    if (!name) {
      setValidationMessage("Project name is required");
      return;
    }

    createProjectMutation.mutate({ name });
  };

  return (
    <Modal show={showModal} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Create a New Project</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form ref={formRef} className="d-flex flex-column gap-2">
          <label className="form-label" htmlFor="name">
            Project Name
          </label>
          <input className="form-control" type="text" id="name" name="name" />
          {validationMessage && (
            <small className="text-danger">{validationMessage}</small>
          )}
        </form>
      </Modal.Body>
      <Modal.Footer>
        <button className="btn btn-secondary" onClick={onClose}>
          Close
        </button>
        <button className="btn btn-primary" onClick={onSubmit}>
          Create
        </button>
      </Modal.Footer>
    </Modal>
  );
};

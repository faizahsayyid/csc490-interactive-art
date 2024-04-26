import React from "react";
import moment from "moment";
import { Project } from "../../types/project";
import { Link } from "react-router-dom";
import { INPUT_DEVICE_INFO } from "../../constants/device/input-device";
import { OUTPUT_DEVICE_INFO } from "../../constants/device/output-device";

type ProjectCardProps = {
  project: Project;
};

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  // console.log("proj_card_proj", project);
  if (!project) {
    return <div>No projects available</div>;
  }
  const id = project.id;
  const name = project.name;
  const lastModifiedFormatted = moment(project.lastModified).fromNow();

  let inputDeviceNames = "None currently";
  let outputDeviceNames = "None currently";

  console.log("project.inputDevices", project);

  // @ts-ignore
  if (Array.isArray(project.input_devices)) {
    // @ts-ignore
    inputDeviceNames = project.input_devices
      // @ts-ignore
      .map((deviceConfig) => INPUT_DEVICE_INFO[deviceConfig.device_name].name)
      .join(", ");
  }
  // @ts-ignore
  if (Array.isArray(project.output_devices)) {
    // @ts-ignore
    outputDeviceNames = project.output_devices
      // @ts-ignore
      .map((deviceConfig) => OUTPUT_DEVICE_INFO[deviceConfig.device_name].name)
      .join(", ");
  }

  // const inputDeviceNames = project.inputDevices
  //   .map((deviceConfig) => INPUT_DEVICE_INFO[deviceConfig.device].name)
  //   .join(", ");
  // const outputDeviceNames = project.outputDevices
  //   .map((deviceConfig) => OUTPUT_DEVICE_INFO[deviceConfig.device].name)
  //   .join(", ");

  return (
    <tr>
      <th scope="row">
        <Link to={`/project/${id}`}>{name}</Link>
      </th>
      <td>{inputDeviceNames}</td>
      <td>{outputDeviceNames}</td>
      <td>{lastModifiedFormatted}</td>
    </tr>
  );
};

export default ProjectCard;

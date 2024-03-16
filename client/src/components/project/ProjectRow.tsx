import React from "react";
import moment from "moment";
import { Project } from "./types";
import { Link } from "react-router-dom";

type ProjectCardProps = {
  project: Project;
};

const ProjectCard: React.FC<ProjectCardProps> = ({
  project: { id, name, inputDeviceName, outputDeviceName, lastModified },
}) => {
  const lastModifiedFormatted = moment(lastModified).fromNow();

  return (
    <tr>
      <th scope="row">
        <Link to={`/project/${id}`}>{name}</Link>
      </th>
      <td>{inputDeviceName}</td>
      <td>{outputDeviceName}</td>
      <td>{lastModifiedFormatted}</td>
    </tr>
  );
};

export default ProjectCard;

import React from "react";
import ProjectRow from "./ProjectRow";
import { Project } from "../../types/project";

type ProjectTableProps = {
  projects: Project[];
};

export const ProjectTable: React.FC<ProjectTableProps> = ({ projects }) => {
  // console.log("proj_table_projs", projects);
  if (!Array.isArray(projects)) {
    return <div>No projects available</div>;
  }

  return (
    <table className="table table-hover">
      <thead>
        <tr>
          <th scope="col">Name</th>
          <th scope="col">Input</th>
          <th scope="col">Output</th>
          <th scope="col">Last Modified</th>
        </tr>
      </thead>
      <tbody>
        {projects.map((project, i) => (
          <ProjectRow key={i} project={project} />
        ))}
      </tbody>
    </table>
  );
};

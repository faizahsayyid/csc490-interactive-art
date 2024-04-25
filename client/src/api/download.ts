import axios from "axios";
import { API_URL } from "./config";
import { useNavigate } from "react-router-dom";

export const download = async (project_id: string): Promise<void> => {
  const navigator = useNavigate();
  const response = await axios.post(`${API_URL}/arduino/projects/${project_id}/download/`);

  const data = response.data;

  if (response.status !== 200) {
    console.log("error", data);
    alert(data["error"]);

  } else {
    alert("Downloaded to board, please wait for the board to restart.");
    console.log(data["code"])
    // Below code is commented out because I am still implementing the code display page
    // if (confirm("Navigating to the code page, do you want to proceed?")) {
    //   // navigating to the code page, passing the code as an argument
    //   navigator("/project_dep/" + project_id + "/code", { state: { code: data["code"] } });
    // } else {
    //   // navigating back to the project page
    //   navigator("/project_dep/" + project_id);
    // }

    // Temporary code to navigate back to the project page
    navigator("/project_dep/" + project_id);
  }
};
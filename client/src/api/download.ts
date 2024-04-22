import axios from "axios";
import { API_URL } from "./config";

export const downloadDemo = async (): Promise<void> => {
  await axios.post(`${API_URL}/arduino/demo/`);
};

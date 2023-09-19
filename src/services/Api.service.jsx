import axios from "axios";
import { API_BASE_URL } from "../Global";

export const getRecipeList = async () => {
  const response = await axios.get(`${API_BASE_URL}`);
  return response.data;
};

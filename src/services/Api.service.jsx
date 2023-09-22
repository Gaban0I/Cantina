import { API_BASE_URL } from "../Global";
import axios from "axios";

export const getRecipeList = async () => {
  const response = await axios.get(`${API_BASE_URL}/recipes`);
  return response.data;
};

export const updateRecipe = async (id, recipeData) => {
  const response = await axios.put(`${API_BASE_URL}/recipe/${id}`, recipeData);
  return response.data;
};

export const deleteRecipe = async (id) => {
  const response = await axios.delete(`${API_BASE_URL}/recipe/${id}`);
  return response.data;
};

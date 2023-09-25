// recipeSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getRecipeList } from "../services/Api.service";

// Thunk pour l'appel asynchrone
export const fetchRecipes = createAsyncThunk(
  "recipes/fetchRecipes",
  async () => {
    const response = await getRecipeList();
    return response;
  }
);

const recipeSlice = createSlice({
  name: "recipes",
  initialState: {
    items: [],
    status: "idle", // idle, loading, succeeded, failed
    error: null,
    filters: {
      title: "",
      difficulty: "",
      minPersons: "1",
      maxPersons: "",
      maxPreparationTime: "",
    },
  },
  reducers: {
    setFilter: (state, action) => {
      const { name, value } = action.payload;
      state.filters[name] = value;
    },
    resetFilters: (state) => {
      state.filters = {
        // Ici, remettez à zéro state.filters
        title: "",
        difficulty: "",
        minPersons: "",
        maxPersons: "",
        maxPreparationTime: "",
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRecipes.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchRecipes.fulfilled, (state, action) => {
        state.status = "succeeded";
        // Ajouter une image par défaut pour les recettes qui n'en ont pas
        action.payload.forEach((recipe) => {
          if (!recipe.photo) {
            recipe.photo =
              "https://lumiere-a.akamaihd.net/v1/images/ogas-cantina-main-2_4231bbfd.jpeg?region=0%2C0%2C1280%2C720";
          }
        });
        state.items = action.payload;
        // Trouver le nombre maximum de personnes parmi toutes les recettes
        const maxPersonsInRecipes = Math.max(
          ...state.items.map((recipe) => recipe.personnes)
        );
        state.filters.maxPersons = maxPersonsInRecipes.toString();
      })
      .addCase(fetchRecipes.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const { setFilter, resetFilters } = recipeSlice.actions;
export default recipeSlice.reducer;

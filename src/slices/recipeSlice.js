// recipeSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getRecipeList } from '../services/Api.service';

// Thunk pour l'appel asynchrone
export const fetchRecipes = createAsyncThunk('recipes/fetchRecipes', async () => {
  const response = await getRecipeList();
  return response;
});

const recipeSlice = createSlice({
  name: 'recipes',
  initialState: {
    items: [],
    status: 'idle',  // idle, loading, succeeded, failed
    error: null,
    filters: {
      title: "",
      difficulty: "",
      minPersons: "",
      maxPersons: "",
      maxPreparationTime: "",
    }
  },
  reducers: {
    setFilter: (state, action) => {
      const { name, value } = action.payload;
      state.filters[name] = value;
    },
    resetFilters: (state) => {
        state.filters = { // Ici, remettez à zéro state.filters
          title: "",
          difficulty: "",
          minPersons: "",
          maxPersons: "",
          maxPreparationTime: "",
      };
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRecipes.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchRecipes.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchRecipes.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  }
});

export const { setFilter, resetFilters } = recipeSlice.actions;
export default recipeSlice.reducer;

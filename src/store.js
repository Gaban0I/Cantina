import { configureStore } from '@reduxjs/toolkit';
import recipeReducer from './slices/recipeSlice';

const store = configureStore({
  reducer: {
    recipes: recipeReducer
  }
});

export default store;

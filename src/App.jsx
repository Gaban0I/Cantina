import "react-toastify/dist/ReactToastify.css";

import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";

import AddRecipe from "./pages/AddRecipe";
import Header from "./components/Header";
import RecipeDetail from "./pages/RecipeDetail";
import RecipeList from "./pages/RecipeList";
import { ToastContainer } from "react-toastify";

function App() {
  return (
    <Router>
      <Header />
      <ToastContainer />
      <Routes>
        <Route path="/recettes" element={<RecipeList />} />
        <Route path="/recette/:id" element={<RecipeDetail />} />
        <Route path="/add" element={<AddRecipe />} />
        <Route path="*" element={<Navigate to="/recettes" replace />} />
      </Routes>
    </Router>
  );
}

export default App;

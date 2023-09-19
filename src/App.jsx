import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import RecipeList from "./pages/RecipeList";
import RecipeDetail from "./pages/RecipeDetail";
import AddRecipe from "./pages/AddRecipe";
import EditRecipe from "./pages/EditRecipe";
import Header from "./components/Header";

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/recettes" element={<RecipeList />} />
        <Route path="/recette/:id" exact element={RecipeDetail} />
        <Route path="/add" exact component={AddRecipe} />
        <Route path="/edit/:id" exact component={EditRecipe} />
        <Route path="*" element={<Navigate to="/recettes" replace />} />
      </Routes>
    </Router>
  );
}

export default App;

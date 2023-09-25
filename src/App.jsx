import "react-toastify/dist/ReactToastify.css";

import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";

import Header from "./components/Header";
import RecipeDetail from "./pages/RecipeDetail";
import RecipeList from "./pages/RecipeList";
import { ToastContainer } from "react-toastify";
import RecipeForm from "./pages/RecipeForm";

function App() {
  return (
    <Router>
      <Header />
      <ToastContainer />
      <Routes>
        <Route path="/recettes" element={<RecipeList />} />
        <Route path="/recette/:id" element={<RecipeDetail />} />
        <Route path="/add" element={<RecipeForm />} />
        <Route path="*" element={<Navigate to="/recettes" replace />} />
      </Routes>
    </Router>
  );
}

export default App;

import { useState, useEffect } from "react";
import { getRecipeList } from "../services/Api.service";
import styled from "styled-components";
import RecipeCard from "../components/RecipeCard";
import Loader from "../components/Loader";
import Error from "../components/Error";

//#region Styles

const RecipeListStyle = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin: 20px;
  width: 100vw;
  max-width: 1250px;
  & > #filterContainer {
    width: 200px;
    display: flex;
    flex-direction: column;
  }

  & > #recipeContainer {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
`;
//#endregion

function RecipeList() {
  const [allRecipes, setAllRecipes] = useState([]); // Toutes les recettes
  const [displayedRecipes, setDisplayedRecipes] = useState([]); // Recettes affichées (après filtrage)
  const [filters, setFilters] = useState({
    title: "",
    difficulty: "",
    minPersons: "",
    maxPersons: "",
    maxPreparationTime: "",
  }); // Filtres
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Appel de la fonction asynchrone
    fetchRecipes();
  }, []);

  useEffect(() => {
    const filteredRecipes = allRecipes.filter((recipe) => {
      if (
        filters.title &&
        !recipe.titre.toLowerCase().includes(filters.title.toLowerCase())
      ) {
        return false;
      }
      if (filters.difficulty && recipe.niveau !== filters.difficulty) {
        return false;
      }
      // Vous pouvez ajouter d'autres conditions de filtrage ici...
      return true;
    });
    setDisplayedRecipes(filteredRecipes);
    console.log(filters.title);
    console.log(displayedRecipes);
  }, [filters, allRecipes]);

  // Fonction asynchrone pour récupérer les recettes
  const fetchRecipes = async () => {
    setIsLoading(true);
    try {
      const response = await getRecipeList();
      setAllRecipes(response);
      setDisplayedRecipes(response); // Par défaut, toutes les recettes sont affichées
      setIsLoading(false);
    } catch (error) {
      console.error("Erreur lors de la récupération des recettes:", error);
      setError(error);
      setIsLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  return (
    <RecipeListStyle>
      {/* Liste des filtres */}
      <form id="filterContainer">
        <h3>Filtre</h3>
        <input
          type="text"
          name="title"
          placeholder="Titre"
          value={filters.title}
          onChange={handleFilterChange}
        />
        <select
          name="difficulty"
          value={filters.difficulty}
          onChange={handleFilterChange}
        >
          <option value="">Tous les niveaux</option>
          <option value="padawan">Padawan</option>
          <option value="jedi">Jedi</option>
          <option value="maitre">Maître</option>
        </select>
        {/* Ajoutez d'autres champs de filtrage ici... */}
      </form>

      {/* Liste des recettes */}
      <div id="recipeContainer">
        {error !== null ? (
          <Error error={error} />
        ) : isLoading ? (
          <Loader />
        ) : (
          displayedRecipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))
        )}
      </div>
    </RecipeListStyle>
  );
}

export default RecipeList;

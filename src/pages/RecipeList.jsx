import { useState, useEffect } from "react";
import styled from "styled-components";
import RecipeCard from "../components/RecipeCard";
import Loader from "../components/Loader";
import Error from "../components/Error";
import { useDispatch, useSelector } from "react-redux";
import { fetchRecipes } from "../slices/recipeSlice";

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
    flex-flow: row wrap;
    align-items: center;
    justify-content: center;
  }
`;
//#endregion

function RecipeList() {
  const [displayedRecipes, setDisplayedRecipes] = useState([]); // Recettes affichées (après filtrage)

  const dispatch = useDispatch();

  // Utilisez useSelector pour accéder à l'état de votre store
  const recipes = useSelector((state) => state.recipes.items);
  const filters = useSelector((state) => state.recipes.filters);
  const isLoading = useSelector((state) => state.recipes.status === "loading");
  const error = useSelector((state) => state.recipes.error);

  useEffect(() => {
    // Dispatchez l'action pour charger les recettes
    dispatch(fetchRecipes());
  }, [dispatch]);

  useEffect(() => {
    if (recipes && recipes.length > 0) {
      console.log("recipes", recipes);
      const filteredRecipes = recipes.filter((recipe) => {
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
    }
  }, [filters, recipes]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    // Dispatch l'action pour mettre à jour l'état des filtres
    dispatch(setFilter({ name, value }));
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

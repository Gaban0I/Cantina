import {
  fetchRecipes,
  resetFilters,
  setFilter,
  resetEditingMode,
} from "../slices/recipeSlice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";

import Error from "../components/Error";
import Loader from "../components/Loader";
import RecipeCard from "../components/RecipeCard";
import styled from "styled-components";
import { Link } from "react-router-dom";

//#region Styles

const RecipeListStyle = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100vw;
  max-width: 1400px;
  gap: 30px;
  position: relative;
  & > #createRecipeButton {
    position: fixed;
    bottom: 30px;
    right: 30px;
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background-color: white;
    color: black;
    font-size: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    text-decoration: none;
    overflow: visible;
    box-shadow: 0 0 30px 6px rgba(255, 255, 255, 0.6);
    transition: transform 0.1s ease-in-out;
    &:hover {
      transform: scale(1.05);
    }
    &:active {
      transform: scale(0.95);
    }
  }

  & > #filterContainer {
    position: sticky;
    margin-top: 15px;
    display: flex;
    flex-direction: column;
    align-items: center;
    flex-shrink: 0;
    width: 250px;
    background-color: white;
    border-radius: 12px;
    padding: 20px;
    overflow: visible;
    box-shadow: 0 0 30px 6px rgba(255, 255, 255, 0.6);
    transition: transform 0.2s ease-in-out;

    & > #numberPersonFilter {
      display: flex;
      flex-flow: row wrap;
      #numberPersonMin,
      #numberPersonMax {
        margin: 0 10px;
        font-size: 17px;
        display: flex;
        flex-flow: row wrap;
        align-items: center;
        .numberPerson {
          width: 30%;
          margin: 0 5px;
        }
      }
    }

    h3 {
      font-size: 24px;
      font-weight: bold;
      color: #333;
      margin-bottom: 20px;
      text-align: center;
    }

    input,
    select,
    button {
      width: 100%;
      padding: 10px;
      border-radius: 8px;
      border: 1px solid #ddd;
      margin: 7.5px 0;
      font-size: 16px;
    }

    #ResetFilter {
      width: 90%;
      cursor: pointer;
      transition: transform 0.1s;
    }

    #ResetFilter:hover {
      background-color: #ddd;
      transform: scale(1.05);
    }
    #ResetFilter:active {
      transform: scale(0.95);
    }

    input::placeholder {
      color: #aaa;
    }
  }

  & > #recipeContainer {
    width: 100%;
    flex-grow: 1;
    display: flex;
    flex-flow: row wrap;
    justify-content: center;
    gap: 10px;
    & > #noRecipe {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      height: 90vh;
      text-align: center;
      align-items: center;
      font-size: 35px;
      color: #aaa;
    }
  }
`;
//#endregion

function RecipeList() {
  const [displayedRecipes, setDisplayedRecipes] = useState([]); // Recettes affichées (après filtrage)

  const dispatch = useDispatch();

  // Utilisez useSelector pour accéder à l'état de votre store

  dispatch(resetEditingMode());
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
        if (
          filters.minPersons &&
          recipe.personnes < parseInt(filters.minPersons)
        ) {
          return false;
        }
        if (
          filters.maxPersons &&
          recipe.personnes > parseInt(filters.maxPersons)
        ) {
          return false;
        }
        if (
          filters.maxPreparationTime &&
          recipe.tempsPreparation > parseInt(filters.maxPreparationTime)
        ) {
          return false;
        }
        return true;
      });
      setDisplayedRecipes(filteredRecipes);
    }
  }, [filters, recipes]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;

    if (name === "maxPersons" && value < filters.minPersons) {
      return;
    }

    if (
      name === "minPersons" &&
      filters.maxPersons &&
      value > filters.maxPersons
    ) {
      return;
    }

    // Dispatch l'action pour mettre à jour l'état des filtres
    dispatch(setFilter({ name, value }));
  };

  return (
    <RecipeListStyle>
      {/* Liste des filtres */}
      <form id="filterContainer">
        <h3>Filtres</h3>
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
        <div id="numberPersonFilter">
          <div id="numberPersonMin">
            <p>pour entre : </p>
            <input
              className="numberPerson"
              type="number"
              name="minPersons"
              placeholder="Nb min de personnes"
              value={filters.minPersons}
              onChange={handleFilterChange}
              min="1"
            />
          </div>
          <div id="numberPersonMax">
            <p> et : </p>
            <input
              className="numberPerson"
              type="number"
              name="maxPersons"
              placeholder="Nb max de personnes"
              value={filters.maxPersons}
              onChange={handleFilterChange}
              min={filters.minPersons || "0"}
            />
            <p>personnes</p>
          </div>
        </div>
        <input
          type="number"
          name="maxPreparationTime"
          placeholder="Temps de préparation"
          value={filters.maxPreparationTime}
          onChange={handleFilterChange}
          min="0"
        />
        <button
          id="ResetFilter"
          type="button"
          onClick={() => dispatch(resetFilters())}
        >
          Réinitialiser les filtres
        </button>
      </form>
      {/* Bouton de création de recette */}
      <Link to={"/add"} id="createRecipeButton">
        +
      </Link>

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
        {displayedRecipes.length === 0 && !isLoading && (
          <p id="noRecipe">Aucune recette ne correspond à vos critères</p>
        )}
      </div>
    </RecipeListStyle>
  );
}

export default RecipeList;

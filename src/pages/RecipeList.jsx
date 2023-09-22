import { fetchRecipes, resetFilters, setFilter } from "../slices/recipeSlice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";

import Error from "../components/Error";
import Loader from "../components/Loader";
import RecipeCard from "../components/RecipeCard";
import styled from "styled-components";

//#region Styles

const RecipeListStyle = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin: 40px;
  width: 100vw;
  max-width: 1400px;
  gap: 30px;

  & > #filterContainer {
    flex-shrink: 0;
    width: 250px;
    background-color: white;
    border-radius: 12px;
    padding: 20px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
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
    select {
      width: 100%;
      padding: 10px;
      border-radius: 8px;
      border: 1px solid #ddd;
      margin: 7.5px 0;
      font-size: 16px;
    }

    input::placeholder {
      color: #aaa;
    }
  }

  & > #recipeContainer {
    flex-grow: 1;
    display: flex;
    flex-flow: row wrap;
    justify-content: flex-start;
    gap: 10px;
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
          placeholder="Temps de préparation max (en min)"
          value={filters.maxPreparationTime}
          onChange={handleFilterChange}
          min="0"
        />
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

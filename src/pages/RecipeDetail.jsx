import { deleteRecipe } from "../services/Api.service";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import CloseIcon from "@mui/icons-material/Close";
import Error from "../components/Error";
import Loader from "../components/Loader";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import Suppression from "../components/Suppression";
import { fetchRecipes } from "../slices/recipeSlice";
import styled from "styled-components";
import { toast } from "react-toastify";
import RecipeForm from "./RecipeForm";

//#region Styles
const RecipeWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 600px;
  max-width: 90vw;
  margin: auto;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.4);
  position: relative;
  & > #EditCloseContainer {
    display: flex;
    justify-content: flex-end;
    position: absolute;
    right: 20px;
    top: 20px;
    gap: 10px;
    overflow: visible;
    & > .EditCloseIcon {
      cursor: pointer;
      color: #fff;
      border: 1px solid #fff;
      background-color: #000;
      border-radius: 50px;
      padding: 5px;
      height: 30px;
      width: 30px;
      box-shadow: 0px 0px 40px 10px rgba(255, 255, 255, 0.9);
      transition: 0.2s ease-in-out;
    }
    & > .EditCloseIcon:hover {
      background-color: #fff;
      color: #000;
      border-color: #000;
    }
  }
`;

const RecipeImage = styled.img`
  width: 100%;
  object-fit: cover;
  height: 300px;
`;

const RecipeContent = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px;
  background-color: #f7f7f7;
  & > .RecipeTitle {
    font-size: 24px;
    margin-bottom: 16px;
    color: #333;
  }
  & > .RecipeDescription {
    font-size: 16px;
    margin-bottom: 20px;
    color: #555;
  }
  & > .IngredientList {
    list-style: none;
    padding: 0;
    & > .IngredientItem {
      display: flex;
      gap: 8px;
    }
  }
  & > .StepList {
    & > .StepItem {
      font-size: 16px;
      color: #555;
      line-height: 1.5;
      width: 100%;
      margin-bottom: 16px;
      display: flex;
      flex-direction: row;
      align-items: center;
    }
  }

  .ArticleTitle {
    margin: 10px 0px;
  }
`;

//#endregion

function RecipeDetail() {
  const dispatch = useDispatch();

  //#region Affichage de la recette
  const { id } = useParams();

  const fetchError = useSelector((state) => state.recipes.error);
  const recipesStatus = useSelector((state) => state.recipes.status);
  const recipe = useSelector((state) =>
    state.recipes.items.find((recipe) => recipe.id === parseInt(id))
  );

  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (recipesStatus === "idle") {
      dispatch(fetchRecipes());
    }
  }, [recipesStatus, dispatch]);

  const formatTime = (minutes) => {
    if (minutes < 60) return `${minutes}min`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h${remainingMinutes ? remainingMinutes : ""}`;
  };
  //#endregion

  //#region Edit mode
  const handleEditClick = () => {
    setIsEditing(true); // passe l'état d'édition à true
  };

  //#endregion

  //#region Delete mode

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const handleDeleteClick = () => {
    setOpenDeleteDialog(true);
  };
  const navigate = useNavigate();

  const handleConfirmDelete = async () => {
    try {
      await deleteRecipe(id);
      toast.success("Recette supprimée avec succès !");
      setOpenDeleteDialog(false);
      navigate("/recettes");
    } catch (error) {
      console.error("Erreur lors de la suppression de la recette:", error);
      toast.error("Erreur lors de la suppression de la recette.");
    }
  };

  //#endregion

  //#region return page
  if (recipesStatus === "loading" || recipesStatus === "idle") {
    return <Loader />;
  }

  if (fetchError || (recipesStatus === "succeeded" && !recipe)) {
    const errorMessage = fetchError
      ? fetchError
      : "La recette demandée est introuvable.";
    return <Error error={errorMessage} />;
  }

  return (
    <>
      {isEditing ? (
        <RecipeForm initialData={recipe} mode="edit" />
      ) : (
        <RecipeWrapper>
          <Suppression
            open={openDeleteDialog}
            onConfirm={handleConfirmDelete}
            onClose={() => setOpenDeleteDialog(false)}
          />
          <div id="EditCloseContainer">
            <ModeEditIcon className="EditCloseIcon" onClick={handleEditClick} />
            <CloseIcon className="EditCloseIcon" onClick={handleDeleteClick} />
          </div>

          <RecipeImage src={recipe.photo} alt={recipe.titre} />
          <RecipeContent>
            <h1 className="RecipeTitle">{recipe.titre}</h1>
            <p className="RecipeDescription">{recipe.description}</p>

            <h2 className="ArticleTitle">Ingrédients:</h2>
            <ul className="IngredientList">
              {recipe.ingredients.map(([quantity, ingredient], index) => (
                <li className="IngredientItem" key={index}>
                  {quantity} {ingredient}
                </li>
              ))}
            </ul>

            <h2 className="ArticleTitle">Étapes:</h2>
            <ol className="StepList">
              {recipe.etapes.map((etape, index) => (
                <li className="StepItem" key={index}>
                  {etape}
                </li>
              ))}
            </ol>

            <div>
              <strong>Niveau :</strong> {recipe.niveau}
            </div>
            <div>
              <strong>Nombre de personnes :</strong> {recipe.personnes}
            </div>
            <div>
              <strong>Temps de préparation :</strong>{" "}
              {formatTime(recipe.tempsPreparation)}
            </div>
          </RecipeContent>
        </RecipeWrapper>
      )}
    </>
  );

  //#endregion
}

export default RecipeDetail;

import { deleteRecipe, updateRecipe } from "../services/Api.service";
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

//#region Styles
const RecipeWrapper = styled.div`
  width: 600px;
  max-width: 90vw;
  margin: 40px auto;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  position: relative;
  & > #EditCloseContainer {
    display: flex;
    justify-content: flex-end;
    position: absolute;
    right: 20px;
    top: 20px;
    & > .EditCloseIcon {
      margin-right: 10px;
      cursor: pointer;
      color: #fff;
      border: 1px solid #fff;
      background-color: #000;
      border-radius: 50%;
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
  & > #ImageLink {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-bottom: 20px;
  }
  /* bouton d'ajout d'ingrédient et d'étape */
  & > button {
    width: 100%;
    padding: 10px;
    border-radius: 8px;
    border: 1px solid #ddd;
    margin: 7.5px 0;
    font-size: 16px;
    cursor: pointer;
    background-color: transparent;
    transition: 0.2s ease-in-out;
  }
  & > button:hover {
    background-color: #4caf50;
    color: white;
  }
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
      & > input {
        font-size: 16px;
        color: #555;
        margin-bottom: 8px;
        width: 40%;
        text-align: center;
      }
      & > button {
        width: auto;
        padding: 10px;
        border-radius: 8px;
        border: 1px solid #ddd;
        margin-bottom: 8px;
        font-size: 16px;
        cursor: pointer;
        background-color: transparent;
        transition: 0.2s ease-in-out;
        &:hover {
          background-color: #f44336;
          color: white;
        }
      }
    }
  }
  & > .StepList {
    & > .StepItem,
    textarea {
      font-size: 16px;
      color: #555;
      line-height: 1.5;
      width: 100%;
    }
    & > .StepItem {
      margin-bottom: 16px;
      display: flex;
      flex-direction: row;
      align-items: center;
      & > button {
        width: auto;
        padding: 10px;
        border-radius: 8px;
        border: 1px solid #ddd;
        margin-left: 8px;
        font-size: 16px;
        cursor: pointer;
        background-color: transparent;
        transition: 0.2s ease-in-out;
        &:hover {
          background-color: #f44336;
          color: white;
        }
      }
    }
  }
  & > #buttonContainer {
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
    flex-flow: row wrap;
    & > button {
      width: 48%;
      padding: 10px;
      border-radius: 8px;
      border: 1px solid #ddd;
      margin: 7.5px 0;
      font-size: 16px;
      cursor: pointer;
      background-color: transparent;
      transition: 0.2s ease-in-out;
    }
    & > button:nth-child(1):hover {
      background-color: #4caf50;
      color: white;
    }
    & > button:nth-child(2):hover {
      background-color: #f44336;
      color: white;
    }
  }

  .ArticleTitle {
    margin: 10px 0px;
  }

  input,
  select,
  textarea {
    width: 100%;
    padding: 10px;
    border-radius: 8px;
    border: 1px solid #ddd;
    font-size: 16px;
  }

  input::placeholder {
    color: #aaa;
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
  const [editedRecipe, setEditedRecipe] = useState({});

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
    setEditedRecipe(recipe); // initialise l'état édité avec la recette actuelle
  };

  const handleSaveChanges = async () => {
    try {
      await updateRecipe(id, editedRecipe);
      setIsEditing(false);
      dispatch(fetchRecipes());
      console.log("Recette mise à jour avec succès !");
      toast.success("Recette mise à jour avec succès !");
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la recette:", error);
      toast.error("Erreur lors de la mise à jour de la recette.");
    }
  };

  useEffect(() => {
    // Gestion de la hauteur des textarea en mode édition
    if (isEditing) {
      // Sélectionnez tous les textarea
      const textareas = document.querySelectorAll(".StepList textarea");
      // Fonction pour ajuster la hauteur de tous les textarea
      function adjustHeight(textarea) {
        textarea.style.height = "auto";
        textarea.style.height = textarea.scrollHeight + "px";
      }
      // Écoutez les événements qui peuvent affecter la taille du contenu de chaque textarea
      textareas.forEach((textarea) => {
        adjustHeight(textarea); // ajuster la hauteur initiale
        textarea.addEventListener("input", () => adjustHeight(textarea));
      });
      return () => {
        // Nettoyez les event listeners lorsque le composant est démonté ou le mode d'édition change
        textareas.forEach((textarea) => {
          textarea.removeEventListener("input", () => adjustHeight(textarea));
        });
      };
    }
  }, [isEditing]);

  const addIngredientField = () => {
    setEditedRecipe((prevState) => ({
      ...prevState,
      ingredients: [...prevState.ingredients, ["", ""]],
    }));
  };

  const removeIngredientField = (indexToRemove) => {
    setEditedRecipe((prevState) => ({
      ...prevState,
      ingredients: prevState.ingredients.filter(
        (_, index) => index !== indexToRemove
      ),
    }));
  };

  const addStepField = () => {
    setEditedRecipe((prevState) => ({
      ...prevState,
      etapes: [...prevState.etapes, ""],
    }));
  };

  const removeStepField = (indexToRemove) => {
    setEditedRecipe((prevState) => ({
      ...prevState,
      etapes: prevState.etapes.filter((_, index) => index !== indexToRemove),
    }));
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
    <RecipeWrapper>
      <Suppression
        open={openDeleteDialog}
        onConfirm={handleConfirmDelete}
        onClose={() => setOpenDeleteDialog(false)}
      />
      {!isEditing && (
        <div id="EditCloseContainer">
          <ModeEditIcon className="EditCloseIcon" onClick={handleEditClick} />
          <CloseIcon className="EditCloseIcon" onClick={handleDeleteClick} />
        </div>
      )}

      {isEditing ? (
        <>
          <RecipeImage src={editedRecipe.photo} alt={recipe.titre} />
          <RecipeContent>
            <div id="ImageLink">
              <p>Lien de l'image :</p>
              <input
                type="text"
                value={editedRecipe.photo}
                onChange={(e) =>
                  setEditedRecipe({ ...editedRecipe, photo: e.target.value })
                }
              />
            </div>
            <input
              className="RecipeTitle"
              type="text"
              value={editedRecipe.titre}
              onChange={(e) =>
                setEditedRecipe({ ...editedRecipe, titre: e.target.value })
              }
            />
            <textarea
              className="RecipeDescription"
              value={editedRecipe.description}
              onChange={(e) =>
                setEditedRecipe({
                  ...editedRecipe,
                  description: e.target.value,
                })
              }
            />
            <h2 className="ArticleTitle">Ingrédients:</h2>
            <ul className="IngredientList">
              {editedRecipe.ingredients.map(([quantity, ingredient], index) => (
                <li className="IngredientItem" key={index}>
                  <input
                    type="text"
                    value={quantity}
                    onChange={(e) =>
                      setEditedRecipe({
                        ...editedRecipe,
                        ingredients: editedRecipe.ingredients.map((item, idx) =>
                          idx === index ? [e.target.value, ingredient] : item
                        ),
                      })
                    }
                  />
                  <input
                    type="text"
                    value={ingredient}
                    onChange={(e) =>
                      setEditedRecipe({
                        ...editedRecipe,
                        ingredients: editedRecipe.ingredients.map((item, idx) =>
                          idx === index ? [quantity, e.target.value] : item
                        ),
                      })
                    }
                  />
                  <button onClick={() => removeIngredientField(index)}>
                    Supprimer
                  </button>
                </li>
              ))}
            </ul>
            <button onClick={addIngredientField}>Ajouter un ingrédient</button>
            <h2 className="ArticleTitle">Étapes:</h2>
            <ol className="StepList">
              {editedRecipe.etapes.map((etape, index) => (
                <li className="StepItem" key={index}>
                  <textarea
                    value={etape}
                    onChange={(e) =>
                      setEditedRecipe({
                        ...editedRecipe,
                        etapes: editedRecipe.etapes.map((step, idx) =>
                          idx === index ? e.target.value : step
                        ),
                      })
                    }
                  />
                  <button onClick={() => removeStepField(index)}>
                    Supprimer cette étape
                  </button>
                </li>
              ))}
            </ol>
            <button onClick={addStepField}>Ajouter une étape</button>
            <div>
              <label>
                <h2 className="ArticleTitle">Niveau :</h2>
                <select
                  value={editedRecipe.niveau}
                  onChange={(e) =>
                    setEditedRecipe({ ...editedRecipe, niveau: e.target.value })
                  }
                >
                  <option value="padawan">Padawan</option>
                  <option value="jedi">Jedi</option>
                  <option value="maitre">Maitre</option>
                </select>
              </label>
            </div>
            <div>
              <label>
                <h2 className="ArticleTitle">Nombre de personnes :</h2>
                <input
                  type="number"
                  value={editedRecipe.personnes}
                  onChange={(e) =>
                    setEditedRecipe({
                      ...editedRecipe,
                      personnes: e.target.value,
                    })
                  }
                />
              </label>
            </div>
            <div>
              <label>
                <h2 className="ArticleTitle">
                  Temps de préparation (en minutes) :
                </h2>
                <input
                  type="number"
                  value={editedRecipe.tempsPreparation}
                  onChange={(e) =>
                    setEditedRecipe({
                      ...editedRecipe,
                      tempsPreparation: e.target.value,
                    })
                  }
                />
              </label>
            </div>
            <div id="buttonContainer">
              <button onClick={handleSaveChanges}>Enregistrer</button>
              <button onClick={() => setIsEditing(false)}>Annuler</button>
            </div>
          </RecipeContent>
        </>
      ) : (
        <>
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
        </>
      )}
    </RecipeWrapper>
  );
  //#endregion
}

export default RecipeDetail;

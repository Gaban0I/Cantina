import { useState, useEffect } from "react";
import styled from "styled-components";
import { addRecipe, updateRecipe } from "../services/Api.service";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

// #region Styles
const RecipeContainer = styled.div`
  width: 600px;
  max-width: 90vw;
  margin: auto;
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

// #endregion

const defaultRecipe = {
  photo:
    "https://lumiere-a.akamaihd.net/v1/images/ogas-cantina-main-2_4231bbfd.jpeg?region=0%2C0%2C1280%2C720",
  titre: "",
  description: "",
  ingredients: [["", ""]],
  etapes: [""],
  niveau: "padawan",
  personnes: 1,
  tempsPreparation: 0,
};

function RecipeForm({ initialData, mode }) {
  const [recipeData, setRecipeData] = useState(initialData);
  const navigate = useNavigate();

  useEffect(() => {
    // Sélectionnez tous les textarea
    const textareas = document.querySelectorAll(".StepList textarea");
    // Fonction pour ajuster la hauteur de tous les textarea

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
  }, []);

  function adjustHeight(textarea) {
    textarea.style.height = "auto";
    textarea.style.height = textarea.scrollHeight + "px";
  }

  const handleSubmission = async () => {
    // Vérification de la présence d'une photo
    if (!recipeData.photo) {
      recipeData.photo =
        "https://lumiere-a.akamaihd.net/v1/images/ogas-cantina-main-2_4231bbfd.jpeg?region=0%2C0%2C1280%2C720";
    }

    // Vérification des champs obligatoires
    if (
      !recipeData.titre ||
      !recipeData.description ||
      recipeData.ingredients.length === 0 ||
      recipeData.etapes.length === 0
    ) {
      toast.error("Veuillez compléter tous les champs obligatoires.");
      return;
    }

    // Vérification des types de données et des valeurs valides
    if (typeof recipeData.personnes !== "number" || recipeData.personnes <= 0) {
      toast.error(
        "Veuillez entrer un nombre valide pour le nombre de personnes."
      );
      return;
    }

    if (
      typeof recipeData.tempsPreparation !== "number" ||
      recipeData.tempsPreparation <= 0
    ) {
      toast.error(
        "Veuillez entrer un nombre valide pour le temps de préparation."
      );
      return;
    }

    // Soumission de la recette
    if (mode === "edit") {
      try {
        console.log(recipeData.id);
        const response = await updateRecipe(recipeData.id, recipeData);
        if (response && response.recette && response.recette.id) {
          handleReset(response.recette.id);
        }
        toast.success("Recette mise à jour avec succès !");
      } catch (error) {
        toast.error("Erreur lors de la mise à jour de la recette.");
      }
    } else {
      try {
        const response = await addRecipe(recipeData);
        if (response && response.recette && response.recette.id) {
          handleReset(response.recette.id);
        }
        toast.success("Recette ajoutée avec succès !");
      } catch (error) {
        toast.error("Erreur lors de l'ajout de la recette.");
      }
    }
  };

  const handleReset = (id = "") => {
    if (id === "") {
      setRecipeData(defaultRecipe);
    } else {
      navigate(`/recipe/${id}`);
    }
  };

  const addIngredientField = () => {
    setRecipeData((prevState) => ({
      ...prevState,
      ingredients: [...prevState.ingredients, ["", ""]],
    }));
  };

  const removeIngredientField = (indexToRemove) => {
    setRecipeData((prevState) => ({
      ...prevState,
      ingredients: prevState.ingredients.filter(
        (_, index) => index !== indexToRemove
      ),
    }));
  };

  const addStepField = () => {
    setRecipeData((prevState) => ({
      ...prevState,
      etapes: [...prevState.etapes, ""],
    }));
  };

  const removeStepField = (indexToRemove) => {
    setRecipeData((prevState) => ({
      ...prevState,
      etapes: prevState.etapes.filter((_, index) => index !== indexToRemove),
    }));
  };

  return (
    <RecipeContainer>
      <RecipeImage src={recipeData.photo} alt={recipeData.titre} />
      <RecipeContent>
        <div id="ImageLink">
          <p>Lien de l&#39;image :</p>
          <input
            type="text"
            value={recipeData.photo}
            onChange={(e) =>
              setRecipeData({ ...recipeData, photo: e.target.value })
            }
          />
        </div>
        <input
          className="RecipeTitle"
          type="text"
          value={recipeData.titre}
          onChange={(e) =>
            setRecipeData({ ...recipeData, titre: e.target.value })
          }
        />
        <textarea
          className="RecipeDescription"
          value={recipeData.description}
          onChange={(e) =>
            setRecipeData({
              ...recipeData,
              description: e.target.value,
            })
          }
        />
        <h2 className="ArticleTitle">Ingrédients:</h2>
        <ul className="IngredientList">
          {recipeData.ingredients.map(([quantity, ingredient], index) => (
            <li className="IngredientItem" key={index}>
              <input
                type="text"
                value={quantity}
                onChange={(e) =>
                  setRecipeData({
                    ...recipeData,
                    ingredients: recipeData.ingredients.map((item, idx) =>
                      idx === index ? [e.target.value, ingredient] : item
                    ),
                  })
                }
              />
              <input
                type="text"
                value={ingredient}
                onChange={(e) =>
                  setRecipeData({
                    ...recipeData,
                    ingredients: recipeData.ingredients.map((item, idx) =>
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
          {recipeData.etapes.map((etape, index) => (
            <li className="StepItem" key={index}>
              <textarea
                value={etape}
                onChange={(e) =>
                  setRecipeData({
                    ...recipeData,
                    etapes: recipeData.etapes.map((step, idx) =>
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
              value={recipeData.niveau}
              onChange={(e) =>
                setRecipeData({ ...recipeData, niveau: e.target.value })
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
              value={recipeData.personnes}
              onChange={(e) =>
                setRecipeData({
                  ...recipeData,
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
              value={recipeData.tempsPreparation}
              onChange={(e) =>
                setRecipeData({
                  ...recipeData,
                  tempsPreparation: e.target.value,
                })
              }
            />
          </label>
        </div>
        <div id="buttonContainer">
          <button onClick={handleSubmission}>
            {mode === "edit" ? "Mettre à jour" : "Enregistrer"}
          </button>
          <button onClick={handleReset}>Annuler</button>
        </div>
      </RecipeContent>
    </RecipeContainer>
  );
}

RecipeForm.propTypes = {
  initialData: PropTypes.shape({
    photo: PropTypes.string,
    titre: PropTypes.string,
    description: PropTypes.string,
    ingredients: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string)),
    etapes: PropTypes.arrayOf(PropTypes.string),
    niveau: PropTypes.string,
    personnes: PropTypes.number,
    tempsPreparation: PropTypes.number,
  }),
  mode: PropTypes.string,
};

RecipeForm.defaultProps = {
  initialData: defaultRecipe,
  mode: "create",
};

export default RecipeForm;

import styled from "styled-components";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import Error from "../components/Error";
import ModeEditIcon from "@mui/icons-material/ModeEdit";

const RecipeWrapper = styled.div`
  max-width: 600px;
  margin: 40px auto;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const RecipeImage = styled.img`
  width: 100%;
  object-fit: cover;
  height: 300px;
`;

const RecipeContent = styled.div`
  padding: 20px;
  background-color: #f7f7f7;
`;

const RecipeTitle = styled.h1`
  font-size: 24px;
  margin-bottom: 16px;
  color: #333;
`;

const RecipeDescription = styled.p`
  font-size: 16px;
  margin-bottom: 20px;
  color: #555;
`;

const IngredientList = styled.ul`
  list-style: none;
  padding: 0;
`;

const IngredientItem = styled.li`
  font-size: 16px;
  color: #555;
  margin-bottom: 8px;
`;

const StepList = styled.ol``;

const StepItem = styled.li`
  font-size: 16px;
  color: #555;
  margin-bottom: 16px;
  line-height: 1.5;
`;

function RecipeDetail() {
  const { id } = useParams();
  const recipe = useSelector((state) =>
    state.recipes.items.find((recipe) => recipe.id === parseInt(id))
  );

  if (!recipe) return <Error error="recette non trouvée" />;

  return (
    <RecipeWrapper>
      <RecipeImage src={recipe.photo} alt={recipe.titre} />
      <RecipeContent>
        <RecipeTitle>{recipe.titre}</RecipeTitle>
        <RecipeDescription>{recipe.description}</RecipeDescription>

        <h2>Ingrédients:</h2>
        <IngredientList>
          {recipe.ingredients.map(([quantity, ingredient], index) => (
            <IngredientItem key={index}>
              {quantity} {ingredient}
            </IngredientItem>
          ))}
        </IngredientList>

        <h2>Étapes:</h2>
        <StepList>
          {recipe.etapes.map((etape, index) => (
            <StepItem key={index}>{etape}</StepItem>
          ))}
        </StepList>

        <div>
          <strong>Niveau :</strong> {recipe.niveau}
        </div>
        <div>
          <strong>Nombre de personnes :</strong> {recipe.personnes}
        </div>
        <div>
          <strong>Temps de préparation :</strong> {recipe.tempsPreparation}{" "}
          minutes
        </div>
      </RecipeContent>
    </RecipeWrapper>
  );
}

export default RecipeDetail;

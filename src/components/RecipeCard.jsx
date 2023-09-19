import styled from "styled-components";
import PropTypes from "prop-types";

const RecipeCardContainer = styled.div`
  box-sizing: border-box;
  max-width: 230px;
  background-color: white;
  border-radius: 8px;
  padding: 15px;
  margin: 15px;
  display: flex;
  flex-direction: column;
  align-items: center;

  & > #recipeCardTitle,
  .recipeCardSubtitles {
    text-align: center;
    font-size: 20px;
    font-weight: bold;
    margin: 0px;
    margin-bottom: 8px;
    color: black;
  }
  & > #recipeCardImage {
    width: 200px;
    height: 200px;
    border-radius: 8px;
    margin-bottom: 8px;
  }
  & > .recipeCardSubtitles {
    font-size: 16px;
    font-weight: normal;
  }
`;

const RecipeCard = ({ recipe }) => {
  return (
    <RecipeCardContainer>
      <p id="recipeCardTitle">{recipe.titre}</p>
      <img id="recipeCardImage" src={recipe.photo} alt={recipe.titre} />
      <p className="recipeCardSubtitles">{recipe.niveau}</p>
      <p className="recipeCardSubtitles">{recipe.personnes}</p>
    </RecipeCardContainer>
  );
};

RecipeCard.propTypes = {
  recipe: PropTypes.shape({
    photo: PropTypes.string,
    titre: PropTypes.string.isRequired,
    niveau: PropTypes.string.isRequired,
    personnes: PropTypes.number.isRequired,
  }).isRequired,
};

export default RecipeCard;

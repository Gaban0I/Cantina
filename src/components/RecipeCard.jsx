import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import styled from "styled-components";

const RecipeCardContainer = styled.div`
  box-sizing: border-box;
  max-width: 230px;
  background-color: white;
  border-radius: 12px;
  padding: 15px;
  margin: 15px;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease-in-out;

  &:hover {
    transform: scale(1.05);
    cursor: pointer;
  }

  & > #recipeCardTitle {
    font-size: 24px;
    font-weight: bold;
    color: #333;
    margin-bottom: 12px;
    text-align: center;
  }

  & > #recipeCardImage {
    width: 200px;
    height: 200px;
    border-radius: 12px;
    margin-bottom: 10px;
    object-fit: cover;
  }

  & > #recipeCardInfos {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;

    & > .recipeCardSubtitles {
      font-size: 16px;
      color: #777;
      margin-bottom: 4px;
      text-align: center;
    }
  }
`;
const StyledLink = styled(Link)`
  text-decoration: none; // Pour supprimer le soulignement du lien
  color: inherit; // Pour conserver la couleur du texte
`;

const formatTime = (minutes) => {
  if (minutes < 60) return `${minutes}min`;
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return `${hours}h${remainingMinutes ? remainingMinutes : ""}`;
};

const RecipeCard = ({ recipe }) => {
  return (
    <StyledLink to={`/recette/${recipe.id}`}>
      <RecipeCardContainer>
        <p id="recipeCardTitle">{recipe.titre}</p>
        <img id="recipeCardImage" src={recipe.photo} alt={recipe.titre} />
        <div id="recipeCardInfos">
          <p className="recipeCardSubtitles">Niveau : {recipe.niveau}</p>
          <p className="recipeCardSubtitles">
            Pour {recipe.personnes}
            {recipe.personnes > 1 ? " personnes" : " personne"}
          </p>
          <p className="recipeCardSubtitles">
            Temps de préparation : {formatTime(recipe.tempsPreparation)}
          </p>
        </div>
      </RecipeCardContainer>
    </StyledLink>
  );
};

RecipeCard.propTypes = {
  recipe: PropTypes.shape({
    photo: PropTypes.string,
    titre: PropTypes.string.isRequired,
    id: PropTypes.number.isRequired,
    niveau: PropTypes.string.isRequired,
    personnes: PropTypes.number.isRequired,
    tempsPreparation: PropTypes.number.isRequired,
  }).isRequired,
};

export default RecipeCard;

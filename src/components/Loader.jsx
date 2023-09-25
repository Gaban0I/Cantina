import styled from "styled-components";

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
`;

const DeathStarSpinner = styled.div`
  background-color: #333;
  border: 4px solid #555;
  border-radius: 50%;
  width: 80px;
  height: 80px;
  position: relative;
  animation: spin 4s linear infinite;

  &:before {
    content: "";
    position: absolute;
    top: 20%;
    left: 20%;
    width: 20px;
    height: 20px;
    background-color: #555;
    border-radius: 50%;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const LaserBeam = styled.div`
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 4px;
  height: 20px;
  background-color: red;
  animation: beam 1s infinite alternate;

  @keyframes beam {
    0% {
      height: 20px;
    }
    100% {
      height: 40px;
    }
  }
`;

const LoadingText = styled.p`
  margin-top: 16px;
  font-family: "Star Jedi", sans-serif;
  font-size: 24px;
  color: #fff;
`;

const Loading = () => {
  return (
    <LoadingContainer>
      <DeathStarSpinner>
        <LaserBeam />
      </DeathStarSpinner>
      <LoadingText>Loading...</LoadingText>
    </LoadingContainer>
  );
};

export default Loading;

import { Link } from "react-router-dom";
import React from "react";
import styled from "@emotion/styled";

const HeaderContainer = styled.header`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  & > a {
    color: #333;
    text-decoration: none;
    font-size: 40px;
    margin: 20px;
    font-weight: bold;
  }
`;

function Header() {
  return (
    <HeaderContainer>
      <Link to={"/recettes"}>What Do We Eat On Tatooin ?</Link>
    </HeaderContainer>
  );
}

export default Header;

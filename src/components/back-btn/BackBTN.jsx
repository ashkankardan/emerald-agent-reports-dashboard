import React from "react";
import { Link } from "react-router-dom";
import { BTNContainer, BTNText, MainContainer } from "./BackBTN.styles";

const BackBTN = () => {
  return (
    <MainContainer>
      <Link to="/">
        <BTNContainer>
          <BTNText>Back</BTNText>
        </BTNContainer>
      </Link>
    </MainContainer>
  );
};

export default BackBTN;

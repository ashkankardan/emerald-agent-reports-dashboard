import React from "react";
import EDTLogo from "../../assets/img/EncryptDataTransfer-Logo.png";
import { LogoImg, MainContainer } from "./LogoMotion.styles";

const LogoMotion = ({ size }) => {
  return (
    <MainContainer className={size}>
      <LogoImg
        className={size}
        src={EDTLogo}
        alt="Encrypt Data Transfer logo"
      />
    </MainContainer>
  );
};

export default LogoMotion;

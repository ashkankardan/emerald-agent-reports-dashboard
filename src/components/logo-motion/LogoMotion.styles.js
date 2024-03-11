import styled, { keyframes } from "styled-components";

const fadeInOutAndScale = keyframes`
  0%, 100% {
    opacity: 0.4;
    transform: scale(0.95);
  }
  50% {
    opacity: 1;
    transform: scale(1);
  }
`;

export const MainContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 20px;

  &.small {
    width: 18px;
    display: inline-block;
    padding: 0;
    margin-left: 10px;
    transform: translateY(2px);
  }

  &.medium {
    width: 145px;
    display: inline-block;
    padding: 0;
    margin-left: 10px;
    transform: translateY(2px);
  }
`;

export const LogoImg = styled.img`
  border-radius: 50%;
  animation: ${fadeInOutAndScale} 2s infinite ease;
  width: 90%;
  max-width: 370px;
  min-width: 290px;
  margin: auto;

  &.small,
  &.medium {
    width: 100%;
    max-width: 100%;
    min-width: 100%;
  }
`;

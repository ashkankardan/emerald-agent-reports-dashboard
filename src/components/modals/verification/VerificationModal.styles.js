import styled from "styled-components";

export const MainContainer = styled.div`
  width: 100vw;
  background-color: black;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const ModalContent = styled.div`
  width: 400px;
  height: 185px;
  background-color: #555;
  border-radius: 5px;
  padding: 20px;
  box-sizing: border-box;
  top: 50%;
  transform: translateY(-50%);
  position: absolute;
  font-size: 20px;
  font-weight: bold;
  text-align: center;
`;

export const Question = styled.div`
  width: 100%;
  margin-bottom: 20px;
  color: white;
`;

export const Btn = styled.div`
  width: 100%;
  cursor: pointer;
  border-radius: 5px;
  padding: 10px;
  margin-bottom: 10px;
  color: black;
  transition: all 0.3s;

  &.yes {
    background-color: green;

    &:hover {
      background-color: darkgreen;
      color: white;
    }
  }

  &.no {
    background-color: red;

    &:hover {
      background-color: darkred;
      color: white;
    }
  }
`;

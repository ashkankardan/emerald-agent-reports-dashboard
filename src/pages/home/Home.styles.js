import styled from "styled-components";

export const MainContainer = styled.div`
  width: 100%;
  height: 100vh;
  color: white;
`;

export const MainContent = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 20px;

  a {
    text-decoration: none;
    color: inherit;
  }
`;

export const BTNText = styled.p`
  color: gray;
  transition: all 0.3s ease;
  font-weight: bold;
  font-size: 20px;
`;

export const BTNContainer = styled.div`
  width: 300px;
  height: 40px;
  border: 2px solid gray;
  border-radius: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s ease;

  &:not(:last-child) {
    margin-bottom: 20px;
  }

  &:hover {
    border-color: darkgray;

    ${BTNText} {
      color: darkgray;
    }
  }

  &:active {
    border-color: lightgray;

    ${BTNText} {
      color: lightgray;
    }
  }
`;

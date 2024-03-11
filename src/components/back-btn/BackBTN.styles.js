import styled from "styled-components";

export const MainContainer = styled.div`
  width: 100%;
  margin: 30px 0;
  display: flex;
  justify-content: end;

  a {
    text-decoration: none;
    color: inherit;
  }
`;

export const BTNText = styled.div`
  color: gray;
  font-weight: bold;
`;

export const BTNContainer = styled.div`
  width: 100px;
  height: 30px;
  border: 2px solid gray;
  border-radius: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    border-color: darkgray;

    ${BTNText} {
      color: darkgray;
    }
  }
`;

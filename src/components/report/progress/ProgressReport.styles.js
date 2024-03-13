import styled from "styled-components";

export const MainContainer = styled.div`
  width: 100%;
  color: white;
  background-color: black;
  padding: 0 15px;
`;

export const MainContent = styled.div`
  width: 100%;
  display: flex;
  justify-content: left;
  position: relative;
`;

export const VerticleDivider = styled.div`
  position: absolute;
  width: 3px;
  height: 380px;
  background-color: teal;
  left: 1080px;
`;

export const Img = styled.img`
  width: 70px;
  transform: translate(-64px, -75px);
`;

export const ProgressItemsContainer = styled.div`
  width: 100%;
`;

export const SectionNavContainer = styled.div`
  width: 100%;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 15px;
`;

export const Btn = styled.div`
  width: 80px;
  height: 30px;
  border: 1px solid gray;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: bold;
  margin-right: 20px;

  &:hover {
    color: purple;
    border-color: purple;
  }
`;

export const Goal = styled.div`
  font-size: 20px;
  font-weight: bold;
`;

import styled from "styled-components";

export const MainContainer = styled.div`
  width: 100%;
  height: 90px;
  padding-top: 12px;
  color: white;
  background-color: black;
  display: flex;
  align-items: center;
  border-top: 1px solid purple;
`;

export const AgentName = styled.div`
  width: 180px;
`;

export const ProgressBarContainer = styled.div`
  width: 900px;
`;

export const ProgressBarContainerEnd = styled.div`
  width: 300px;
`;

export const VerticleDivider = styled.div`
  height: 100%;
  width: 5px;
  background-color: red;
  transform: translateX(-10px);
`;

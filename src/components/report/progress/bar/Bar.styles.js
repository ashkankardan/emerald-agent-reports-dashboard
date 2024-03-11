import styled from "styled-components";

export const MainContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: left;
  align-items: center;
`;

export const WeeklyBar = styled.div`
  width: ${(props) => props.barWidth || 1}%;
  height: 100%;
  background-color: red;
  margin-right: 10px;

  &.green {
    background-color: green;
  }

  &.yellow {
    background-color: yellow;
  }

  &.orange {
    background-color: orange;
  }

  &.red {
    background-color: red;
  }

  &.blue {
    background-color: blue;
  }
`;

export const BarText = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  color: white;
  font-weight: bold;
  transform: translateY(-20px);
`;

export const AvatarContainer = styled.div`
  width: 130px;
  height: 130px;
  transform: translateX(-10px);
  display: flex;
  justify-content: left;
  align-items: center;
`;

export const AvatarImg = styled.img`
  width: 80px;
  height: 80px;

  &.first {
    height: 110px;
    width: 90px;
    transform: translateY(-1px);
  }

  &.second {
    height: 100px;
    transform: translateY(-18px);
  }

  &.third {
    transform: translateY(-15px);
  }

  &.fourth {
    height: 80px;
    width: 70px;
  }
`;

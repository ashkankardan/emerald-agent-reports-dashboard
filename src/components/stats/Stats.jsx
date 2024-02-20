import React from "react";
import { MainContainer, StatItem } from "./Stats.styles";

const Stats = ({ count, amount }) => {
  return (
    <MainContainer>
      <StatItem>
        <span>Total Count:</span> {count}
      </StatItem>
      <StatItem>
        <span>Total Amount:</span> {amount}
      </StatItem>
    </MainContainer>
  );
};

export default Stats;

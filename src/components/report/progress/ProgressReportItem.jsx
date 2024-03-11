import React from "react";
import {
  AgentName,
  MainContainer,
  ProgressBarContainer,
} from "./ProgressReportItem.styles";
import Bar from "./bar/Bar";

const ProgressReportItem = ({ agentEnrollments, goal, index }) => {
  return (
    <MainContainer>
      <AgentName>
        {agentEnrollments.fname} {agentEnrollments.lname}
      </AgentName>
      <ProgressBarContainer>
        <Bar
          monthAmount={Number(agentEnrollments["monthAmount"])}
          goal={Number(goal)}
          index={index}
        />
      </ProgressBarContainer>
    </MainContainer>
  );
};

export default ProgressReportItem;

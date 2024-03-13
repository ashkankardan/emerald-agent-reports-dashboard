import React, { useState, useEffect } from "react";
import {
  AgentName,
  MainContainer,
  ProgressBarContainer,
  ProgressBarContainerEnd,
} from "./ProgressReportItem.styles";
import Bar from "./bar/Bar";
import OverBar from "./bar/OverBar";

const ProgressReportItem = ({ agentEnrollments, goal, index, overGoalMax }) => {
  const [overGoal, setOverGoal] = useState(0);

  useEffect(() => {
    if (!agentEnrollments) return;

    const totalOver = agentEnrollments["monthAmount"] - goal;

    setOverGoal(totalOver);
  }, [agentEnrollments]);

  // useEffect(() => {
  //   console.log("overGoal: ", overGoal, "overGoalMax: ", overGoalMax);
  //   console.log("condition: ", overGoalMax && overGoal > 0);
  // }, [overGoal, overGoalMax]);

  return (
    <MainContainer>
      <AgentName>
        {agentEnrollments.fname} {agentEnrollments.lname}
      </AgentName>
      <ProgressBarContainer
        className={`ProgressBarContainer ${overGoal < 0 && "less"}`}
      >
        <Bar
          monthAmount={Number(agentEnrollments["monthAmount"])}
          goal={Number(goal)}
          index={index}
        />
      </ProgressBarContainer>
      {overGoalMax && overGoal > 0 ? (
        <ProgressBarContainerEnd>
          <OverBar
            overGoalMax={overGoalMax}
            overGoal={overGoal}
            index={index}
          />
        </ProgressBarContainerEnd>
      ) : null}
    </MainContainer>
  );
};

export default ProgressReportItem;

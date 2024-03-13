import React, { useState, useEffect } from "react";
import {
  AvatarContainer,
  AvatarImg,
  BarText,
  EndOverBar,
  MainContainer,
} from "./OverBar.styles";
import {
  calculateProgressBarLength,
  formatPriceAmount,
} from "../../../../helpers";
import CarImg from "../../../../assets/img/car.png";
import HorseImg from "../../../../assets/img/horse.png";
import BicycleImg from "../../../../assets/img/bicycle.png";
import TurtleImg from "../../../../assets/img/turtle.png";

const OverBar = ({ overGoalMax, overGoal, index }) => {
  const [barWidth, setBarWidth] = useState(0);
  const [placement, setPlacement] = useState("fourth");

  useEffect(() => {
    if (!overGoalMax || !overGoal) return;
    const LenPerc = calculateProgressBarLength(overGoal, overGoalMax);
    setBarWidth(LenPerc);
  }, [overGoalMax, overGoal]);

  useEffect(() => {
    if (index === 0) {
      return setPlacement("first");
    } else if (index === 1) {
      return setPlacement("second");
    } else if (index === 2) {
      return setPlacement("third");
    } else if (index > 2) {
      return setPlacement("fourth");
    } else {
      return setPlacement("fourth");
    }
  }, [index]);

  useEffect(() => {
    console.log("barWidth: ", barWidth);
  }, [barWidth]);

  return (
    <MainContainer>
      <EndOverBar barWidth={barWidth} />
      {barWidth > 0 && (
        <AvatarContainer>
          {placement === "first" && (
            <AvatarImg className="first" src={CarImg} />
          )}
          {placement === "second" && (
            <AvatarImg className="second" src={HorseImg} />
          )}
          {placement === "third" && (
            <AvatarImg className="third" src={BicycleImg} />
          )}
          {placement === "fourth" && (
            <AvatarImg className="fourth" src={TurtleImg} />
          )}
        </AvatarContainer>
      )}
    </MainContainer>
  );
};

export default OverBar;

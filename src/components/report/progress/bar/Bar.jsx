import React, { useState, useEffect } from "react";
import {
  AvatarContainer,
  AvatarImg,
  BarText,
  MainContainer,
  WeeklyBar,
} from "./Bar.styles";
import {
  calculateProgressBarLength,
  formatPriceAmount,
} from "../../../../helpers";
import CarImg from "../../../../assets/img/car.png";
import HorseImg from "../../../../assets/img/horse.png";
import BicycleImg from "../../../../assets/img/bicycle.png";
import TurtleImg from "../../../../assets/img/turtle.png";

const Bar = ({ monthAmount, goal, index }) => {
  const [color, setColor] = useState("");
  const [barWidth, setBarWidth] = useState(0);
  const [placement, setPlacement] = useState("fourth");

  useEffect(() => {
    if (!barWidth) return;

    if (barWidth >= 76) {
      return setColor("green");
    } else if (barWidth >= 51) {
      return setColor("yellow");
    } else if (barWidth > 26) {
      return setColor("orange");
    } else if (barWidth === 0) {
      setColor("red");
    } else {
      setColor("red");
    }
  }, [barWidth]);

  useEffect(() => {
    console.log("barWidth: ", barWidth, "color: ", color);
  }, [barWidth]);

  useEffect(() => {
    if (!monthAmount || !goal) return;
    const LenPerc = calculateProgressBarLength(monthAmount, goal);
    setBarWidth(LenPerc);
  }, [monthAmount, goal]);

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

  return (
    <MainContainer>
      <WeeklyBar className={color} barWidth={barWidth}>
        <BarText>{`$${formatPriceAmount(monthAmount)}`}</BarText>
      </WeeklyBar>
      <AvatarContainer>
        {placement === "first" && <AvatarImg className="first" src={CarImg} />}
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
    </MainContainer>
  );
};

export default Bar;

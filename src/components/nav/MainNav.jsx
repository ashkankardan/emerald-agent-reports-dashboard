import React, { useState, useEffect, useContext } from "react";
import {
  CenterCol,
  Divider,
  LeftCol,
  MainContainer,
  MainContent,
  RightCol,
} from "./MainNav.styles";
import { UserContext } from "../../contexts/user-context";
import { LuLogOut } from "react-icons/lu";
import useLogout from "../../hooks/useLogout";

const MainNav = ({ setReportView }) => {
  const { user } = useContext(UserContext);
  const [dateToDisplay, setDateToDisplay] = useState("");
  const handleLogout = useLogout();

  useEffect(() => {
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString("en-US", {
      weekday: "long", // full name of the day
      year: "numeric",
      month: "long", // full name of the month
      day: "numeric",
    });

    setDateToDisplay(formattedDate);
  }, []);

  return (
    <MainContainer>
      <MainContent>
        <LeftCol>
          {user.fname} {user.lname}
        </LeftCol>
        <CenterCol>{dateToDisplay}</CenterCol>
        <RightCol>
          <LuLogOut onClick={handleLogout} />
        </RightCol>
      </MainContent>
      <Divider />
    </MainContainer>
  );
};

export default MainNav;

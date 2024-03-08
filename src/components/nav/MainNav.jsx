import React, { useState, useEffect, useContext } from "react";
import {
  CenterCol,
  Divider,
  InputRow,
  LeftCol,
  MainContainer,
  MainContent,
  RightCol,
  SelectInput,
} from "./MainNav.styles";
import { UserContext } from "../../contexts/user-context";
import { ViewContext } from "../../contexts/view-context.js";
import { LuLogOut } from "react-icons/lu";
import useLogout from "../../hooks/useLogout";

const MainNav = ({ setReportView }) => {
  const { user } = useContext(UserContext);
  const { setView } = useContext(ViewContext);
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
          {(user.role === "admin" || user.role === "super-admin") && (
            <InputRow>
              <SelectInput
                id="enrolled"
                name="enrolled"
                onChange={(e) => setView(e.target.value)}
              >
                <option key="daily" value="daily">
                  Daily
                </option>
                <option key="enrollment" value="enrollment">
                  Enrollment
                </option>
              </SelectInput>
            </InputRow>
          )}

          <LuLogOut onClick={handleLogout} />
        </RightCol>
      </MainContent>

      <Divider />
    </MainContainer>
  );
};

export default MainNav;

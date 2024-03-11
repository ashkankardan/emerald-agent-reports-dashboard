import React, { useContext } from "react";
import { MainContainer } from "./layouts.styles";
import MainNav from "../components/nav/MainNav";
import { UserContext } from "../contexts/user-context";

const Layouts = ({ children }) => {
  const { user } = useContext(UserContext);

  return (
    <MainContainer>
      {user && <MainNav />}
      {children}
    </MainContainer>
  );
};

export default Layouts;

import React, { useEffect, useContext } from "react";
import { MainContainer } from "./Agent.styles";
import BackBTN from "../../components/back-btn/BackBTN";
import { UserContext } from "../../contexts/user-context";
import Reports from "../../components/report/Reports";
import { useNavigate } from "react-router-dom";
import useLogout from "../../hooks/useLogout";

const Agent = () => {
  const { user } = useContext(UserContext);
  const handleLogout = useLogout();

  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }

    if (user.role === "admin" || user.role === "super-admin") {
      navigate("/admin");
    }

    if (
      user &&
      user.role !== "agent" &&
      user.role !== "admin" &&
      user.role !== "super-admin"
    ) {
      handleLogout();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, navigate]);

  return (
    <MainContainer>
      <Reports />
      {/* <BackBTN /> */}
    </MainContainer>
  );
};

export default Agent;

import React, { useEffect, useContext } from 'react';
import { MainContainer } from './Enrollments.styles';
import { UserContext } from "../../contexts/user-context";
import { useNavigate } from "react-router-dom";
import EnrollmentsReports from '../../components/report/EnrollmentsReports';
import { signOut, auth } from "../../config";

const Enrollments = () => {
  const { user, setUser } = useContext(UserContext);

  const navigate = useNavigate();

  useEffect(() => {
    // Check the user's role
    if (!user) {
      // Redirect to '/agent' if the user is not an admin or super-admin
      navigate("/login");
    }
    if (user.role === "agent") {
      // Redirect to '/agent' if the user is not an admin or super-admin
      navigate("/agent");
    }

    if (
      user &&
      user.role !== "agent" &&
      user.role !== "admin" &&
      user.role !== "super-admin"
    ) {
      handleLogout();
    }
  }, [user, navigate]);

  const handleLogout = () => {
    signOut(auth)
      .then((cred) => {
        setUser(null);
        localStorage.removeItem("user");
        navigate("/login");
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  return (
    <MainContainer>
      <EnrollmentsReports />
    </MainContainer>
  );
};

export default Enrollments;

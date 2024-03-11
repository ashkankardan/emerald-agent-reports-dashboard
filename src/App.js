import { Route, Routes } from "react-router-dom";
import Layouts from "./layouts/layouts";
import Signup from "./pages/Signup/Signup";
import Agent from "./pages/agent/Agent";
import Admin from "./pages/admin/Admin";
import Home from "./pages/home/Home";
import DynamicForm from "./pages/dynamic/DynamicForm";
import UserProvider from "./contexts/user-context";
import Login from "./pages/login/Login";
import React, { useEffect, useState } from "react";
import axios from "axios";
import LogoMotion from "./components/logo-motion/LogoMotion";
import ViewProvider from "./contexts/view-context";

function App() {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkIP();
  }, []);

  const checkIP = async () => {
    try {
      const response = await axios.get(process.env.REACT_APP_CHECK_IP_URL);
      if (response.data.status === "success") {
        setIsAuthorized(true);
      } else {
        setIsAuthorized(false);
      }
    } catch (error) {
      console.error("Error checking IP:", error);
      setIsAuthorized(false);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <UserProvider>
        <ViewProvider>
          <Layouts>
            <Routes>
              {/* Public Route */}
              <Route path="/secured/:id" element={<DynamicForm />} />

              <Route path="*" element={<LogoMotion />} />

              {/* Protected Routes */}
              {isAuthorized ? (
                <>
                  <Route path="/" element={<Home />} />
                  <Route path="/signup" element={<Signup />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/agent" element={<Agent />} />
                  <Route path="/admin" element={<Admin />} />
                </>
              ) : (
                <Route path="*" element={<LogoMotion />} />
              )}
            </Routes>
          </Layouts>
        </ViewProvider>
      </UserProvider>
    </>
  );
}

export default App;

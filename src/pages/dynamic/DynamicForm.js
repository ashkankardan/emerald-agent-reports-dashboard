import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { MainContainer, MainContent } from "./DynamicForm.styles";
import AuthForm from "../../components/dynamic/AuthForm";
import { doc, onSnapshot, db } from "../../config";
import UserData from "../../components/dynamic/UserData";
import LogoMotion from "../../components/logo-motion/LogoMotion";

const DynamicForm = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [tempDoc, setTempDoc] = useState(false);

  const params = useParams();
  const uniqueUrl = params.id;

  useEffect(() => {
    const docRef = doc(db, "tempURLs", uniqueUrl);

    const unsubscribe = onSnapshot(docRef, (doc) => {
      if (doc.exists()) {
        setIsAuthorized(true);
      } else {
        setIsAuthorized(false);
        setIsAuthenticated(false);
        setTempDoc(null);
      }
    });

    // Clean up the subscription on unmount
    return () => unsubscribe();
  }, [uniqueUrl, db]);

  return (
    <>
      {isAuthorized ? (
        <MainContainer>
          <MainContent>
            {isAuthenticated ? (
              <UserData tempDoc={tempDoc} />
            ) : (
              <AuthForm
                setIsAuthenticated={setIsAuthenticated}
                setTempDoc={setTempDoc}
                uniqueUrl={uniqueUrl}
              />
            )}
          </MainContent>
        </MainContainer>
      ) : (
        <LogoMotion />
      )}
    </>
  );
};

export default DynamicForm;

import React, { useState, useEffect } from "react";
import { MainContainer, MainContent } from "./SuperAdmin.styles";
import UpdatePhoneSuffix from "./UpdatePhoneSuffix";

const SuperAdmin = () => {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <MainContainer>
      <MainContent>
        {/* <UpdatePhoneSuffix isLoading={isLoading} setIsLoading={setIsLoading} /> */}
      </MainContent>
    </MainContainer>
  );
};

export default SuperAdmin;

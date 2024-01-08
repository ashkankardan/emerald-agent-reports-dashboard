import React from "react";
import { Btn, SectionContainer } from "./SuperAdmin.styles";
import {functions, httpsCallable} from '../../config'

const UpdatePhoneSuffix = ({ isLoading, setIsLoading }) => {


  const callUpdateFunction = async () => {
    setIsLoading(true)
    const addPhoneSuffix = httpsCallable(functions, 'addPhoneSuffixToReports');

    try {
      const result = await addPhoneSuffix();
      console.log(result);
    } catch (error) {
      console.error('Error:', error);
    }

    setIsLoading(false)
  };

  return (
    <SectionContainer>
      <Btn className={isLoading && "disabled"} disabled={isLoading} onClick={callUpdateFunction} >
        {isLoading ? "Loading ..." : "Update Phone Suffix"}
      </Btn>
    </SectionContainer>
  );
};

export default UpdatePhoneSuffix;

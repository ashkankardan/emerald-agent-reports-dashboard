import React from 'react';
import { MainContainer } from './layouts.styles';

const Layouts = ({children}) => {
  return (
    <MainContainer>
      {children}
    </MainContainer>
  );
};

export default Layouts;

import React from 'react';
import { Link } from "react-router-dom";
import { BTNContainer, BTNText, MainContainer, MainContent } from './Home.styles';


const Home = () => {
  return (
    <MainContainer>
      <MainContent>
        <Link to="/signup">
          <BTNContainer>
            <BTNText>
              Signup
            </BTNText>
          </BTNContainer>
        </Link>
        <Link to="/agent">
          <BTNContainer>
            <BTNText>
              Agent
            </BTNText>
          </BTNContainer>
        </Link>
        <Link to="/admin">
          <BTNContainer>
            <BTNText>
              Admin
            </BTNText>
          </BTNContainer>
        </Link>
      </MainContent>
    </MainContainer>
  );
};

export default Home;

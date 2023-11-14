import React, { useEffect, useContext } from 'react';
import { Link } from "react-router-dom";
import { BTNContainer, BTNText, MainContainer, MainContent } from './Home.styles';
import { UserContext } from '../../contexts/user-context';
import { useNavigate } from 'react-router-dom'
import useLogout from '../../hooks/useLogout'

const Home = () => {
  const { user } = useContext(UserContext)
  const navigate = useNavigate()
  const handleLogout = useLogout()

  useEffect(() => {
    if (!user) {
      navigate('/login')
    }

    if (user.role === 'admin' || user.role === 'super-admin') {
      navigate('/admin')
    }

    if (user.role === 'agent') {
      navigate('/agent')
    }

    if (
      user &&
      user.role !== 'agent' &&
      user.role !== 'admin' &&
      user.role !== 'super-admin'
    ) {
      handleLogout()
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, navigate])


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
        <Link to="/login">
          <BTNContainer>
            <BTNText>
              Login
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

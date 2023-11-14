import React from 'react';
import { MainContainer } from './Login.styles';
import LoginForm from '../../components/auth-forms/LoginForm';

const Login = () => {
  return (
    <MainContainer>
      <LoginForm />
    </MainContainer>
  );
};

export default Login;

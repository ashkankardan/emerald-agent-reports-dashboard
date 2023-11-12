import React, { useState, useEffect, useContext } from 'react';
import { MainContainer } from './Agent.styles';
import { usersRef, getDocs, signOut, auth } from '../../config';
import BackBTN from '../../components/back-btn/BackBTN';
import LoginForm from '../../components/auth-forms/LoginForm';
import { UserContext } from '../../contexts/user-context'
import Reports from '../../components/report/Reports';

const Agent = () => {
  const [agents, setAgents] = useState([])
  const { user, setUser } = useContext(UserContext);

  // useEffect(() => {
  //   console.log('user: ', user)
  // }, [user])

  const handleLogout = () => {
    signOut(auth).then((cred) => {
      setUser(null)
      localStorage.removeItem('user');
    }).catch(err => {
      console.log(err.message)
    })
  }

  // useEffect(() => {
  //   getDocs(usersRef).then((snapshot) => {
  //     let tempAgents = []
  //     snapshot.forEach((doc) => {
  //       tempAgents.push({ ...doc.data(), id: doc.id })
  //     })
  //     setAgents(tempAgents)
  //   }).catch(err => { console.log(err.message) })
  // }, [])


  return (
    <MainContainer>
      Agent


      {
        user ? <>
          <button onClick={handleLogout}>Logout</button>
          <Reports />
        </> : <LoginForm setUser={setUser} />
      }
      {/* <BackBTN /> */}

    </MainContainer>
  );
};

export default Agent;

import React, { useState, useEffect, useContext } from 'react';
import { MainContainer } from './Admin.styles';
import BackBTN from '../../components/back-btn/BackBTN';
import { usersRef, getDocs, signOut, auth } from '../../config';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../contexts/user-context';
import AdminReports from '../../components/report/AdminReports.jsx';
import SuperAdmin from '../../components/super-admin/SuperAdmin';


const Admin = () => {
  const [adminView, setAdminView] = useState('admin')

  const { user, setUser } = useContext(UserContext)

  const navigate = useNavigate();


  useEffect(() => {

    // Check the user's role
    if (!user) {
      // Redirect to '/agent' if the user is not an admin or super-admin
      navigate('/login');
    }
    if (user.role === 'agent') {
      // Redirect to '/agent' if the user is not an admin or super-admin
      navigate('/agent');
    }

    if (user && user.role !== 'agent' && user.role !== 'admin' && user.role !== 'super-admin') {
      handleLogout()
    }


  }, [user, navigate]);

  const handleLogout = () => {
    signOut(auth).then((cred) => {
      setUser(null)
      localStorage.removeItem('user');
      navigate('/login');
    }).catch(err => {
      console.log(err.message)
    })
  }

  return (
    <MainContainer>
      {adminView === 'admin' && <AdminReports />}
      {adminView === 'superAdmin' && <SuperAdmin />}
      {/* <BackBTN /> */}
    </MainContainer>
  );
};

export default Admin;

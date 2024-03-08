import React, { useState, useEffect, useContext } from 'react';
import { MainContainer } from './Admin.styles';
import { signOut, auth } from '../../config';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../contexts/user-context';
import { ViewContext } from '../../contexts/view-context.js';
import AdminReports from '../../components/report/AdminReports.jsx';
import SuperAdmin from '../../components/super-admin/SuperAdmin';
import EnrollmentsReports from '../../components/report/EnrollmentsReports.jsx';


const Admin = ({ reportView }) => {
  const [adminView, setAdminView] = useState('admin')

  const { user, setUser } = useContext(UserContext)
  const { view } = useContext(ViewContext)

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
      {
        view === 'daily' && <>
          {adminView === 'admin' && <AdminReports />}
          {adminView === 'superAdmin' && <SuperAdmin />}
        </>
      }
      {
        view === 'enrollment' && <EnrollmentsReports />
      }
      {/* <BackBTN /> */}
    </MainContainer>
  );
};

export default Admin;

import React, {useEffect} from 'react';
import { MainContainer } from './Admin.styles';
import BackBTN from '../../components/back-btn/BackBTN';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../contexts/user-context';


const Admin = () => {
  const {user} = UserContext()

  const navigate = useNavigate();


  useEffect(() => {
    // Check the user's role
    if (user.role !== 'admin' && user.role !== 'super-admin') {
      // Redirect to '/agent' if the user is not an admin or super-admin
      navigate('/agent');
    }

    return null;
  }, [user, navigate]);

  return (
    <MainContainer>
      Admin
      {/* <BackBTN /> */}
    </MainContainer>
  );
};

export default Admin;

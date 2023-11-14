import {useContext} from 'react';
import {UserContext} from '../contexts/user-context'
import {signOut, auth} from '../config'
import { useNavigate } from 'react-router-dom';

const useLogout = () => {
  const {setUser} = useContext(UserContext)
  const navigate = useNavigate()

  const handleLogout = () => {
    signOut(auth).then((cred) => {
      setUser(null)
      localStorage.removeItem('user');
      navigate('/login');
    }).catch(err => {
      console.log(err.message)
    })
  }

  return handleLogout
};

export default useLogout;

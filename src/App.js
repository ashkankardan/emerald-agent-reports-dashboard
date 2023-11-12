import { Route, Routes } from 'react-router-dom';
import Layouts from "./layouts/layouts";
import Signup from './pages/Signup/Signup';
import Agent from './pages/agent/Agent';
import Admin from './pages/admin/Admin';
import Home from './pages/home/Home'
import UserProvider from './contexts/user-context';

function App() {
  return (
    <UserProvider>
      <Layouts>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/agent" element={<Agent />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </Layouts>
    </UserProvider>
  );
}

export default App;

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import EditForm from './components/EditForm';
import DefaultForm from './components/DefaultForm';
import SuccessPage from './components/SuccessPage';
import EyeTracking from './components/EyeTracking';
import InviteParticipants from './components/InviteParticipants'; // Import InviteParticipants

function App() {
  // This example uses localStorage to check if the user is logged in
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={isLoggedIn ? <Home /> : <Navigate to="/" replace />} />
        <Route path="/edit/:formID" element={<EditForm />} />
        <Route path="/default-form" element={<DefaultForm />} />
        <Route path="/success" element={<SuccessPage />} />
        <Route path="/eyetracking" element={<EyeTracking />} />
       <Route path="/invite" element={<InviteParticipants />} />
      </Routes>
    </Router>
  );
}

export default App;

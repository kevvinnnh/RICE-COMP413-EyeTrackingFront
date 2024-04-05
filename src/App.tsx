import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import EditForm from './components/EditForm';
import DefaultForm from './components/DefaultForm';
import SuccessPage from './components/SuccessPage';
import EyeTracking from './components/EyeTracking';
import InviteParticipants from './components/InviteParticipants'; // Import InviteParticipants

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/edit/:formID" element={<EditForm />} />
        <Route path="/default-form" element={<DefaultForm />} />
        <Route path="/success" element={<SuccessPage />} />
        <Route path="/eyetracking" element={<EyeTracking />} />
        <Route path="/invite" element={<InviteParticipants />} /> {/* Added route for InviteParticipants */}
      </Routes>
    </Router>
  );
}

export default App;

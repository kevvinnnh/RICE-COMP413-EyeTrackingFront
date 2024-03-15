import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import EditForm from './components/EditForm';
import DefaultForm from './components/DefaultForm';
import SuccessPage from './components/SuccessPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/edit/:formID" element={<EditForm />} />
        {/* ADDED the line below*/}
        <Route path="/default-form" element={<DefaultForm />} />
        <Route path="/success" element={<SuccessPage />} />
      </Routes>
    </Router>
  );
}

export default App;
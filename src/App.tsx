import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import EditForm from './components/EditForm';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/edit/:formID" element={<EditForm />} />
      </Routes>
    </Router>
  );
}

export default App;
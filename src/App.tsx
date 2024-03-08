import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import EditForm from './components/EditForm';
import PrepopulatedForm from './components/PrepopulatedForm';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/edit/:formID" element={<EditForm />} />
        {/* ADDED the line below*/}
        <Route path="/prepopulated-form" element={<PrepopulatedForm />} />
      </Routes>
    </Router>
  );
}

export default App;
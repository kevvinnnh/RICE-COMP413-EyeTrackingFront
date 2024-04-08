import * as React from 'react';
import axios from 'axios';

function App() {
  const [email, setEmail] = React.useState('');
  const [token, setToken] = React.useState('');
  const [feedback, setFeedback] = React.useState('');

  const generateToken = () => {
    return Math.random().toString(36).substring(2, 15);
  };

  const sendLoginRequest = async () => {
    try {
      const response = await axios.post('http://localhost:5001/login', {
        email,
        token
      });
      console.log('Login successful', response.data);
      setFeedback('Login successful.');
    } catch (error) {
      console.error('Login failed', error);
      setFeedback('Login failed. Please try again later.');
    }
  };
  
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newToken = generateToken();
    setToken(newToken);
    sendLoginRequest();
};

  return (
    <div className="App">
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter email" />
        <button type="submit">Login</button>
      </form>
      {feedback && <p>{feedback}</p>}
    </div>
  );
}

export default App;

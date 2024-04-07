import * as React from 'react';
import emailjs from '@emailjs/browser';

function App() {
  const [feedback, setFeedback] = React.useState('');
  const [emailTokenMap, setEmailTokenMap] = React.useState({}); // State to store email-token mappings

  const generateToken = (): string => {
    // Generate a random token
    return Math.random().toString(36).substring(2, 15);
  };
  const sendEmail = (e: React.FormEvent<HTMLFormElement>) => { 
    e.preventDefault();

    const token = generateToken(); // Generate a new token
    const emailFrom = e.currentTarget.email_from.value; // Get sender's email

    // Create a hidden input for the token
    const tokenInput = document.createElement("input");
    tokenInput.type = "hidden";
    tokenInput.name = "token";
    tokenInput.value = token;
    e.currentTarget.appendChild(tokenInput);

    emailjs.sendForm('service_tf822zh', 'template_jsbrfn9', e.currentTarget, 'AfSmL--5Xp1qfkypO')
      .then((result) => {
        console.log('Email successfully sent', result);
        setFeedback('Email sent successfully.');

        // Update the email-token mapping
        setEmailTokenMap(prevMap => ({ ...prevMap, [emailFrom]: token }));

        // Clean up: remove the token input after sending
        e.currentTarget.removeChild(tokenInput);
      }, (error) => {
        console.error('Failed to send email', error);
        setFeedback('Failed to send email. Please try again later.');

        // Clean up even if failed
        e.currentTarget.removeChild(tokenInput);
      });
  };


  return (
    <div className="App min-h-screen flex flex-col justify-center items-center bg-white font-inter">
      <h1 className="text-4xl font-bold mb-6 text-gray-800">Invite Participant</h1>
      <form className="w-full max-w-md space-y-5" onSubmit={sendEmail}>
        <div>
          <label htmlFor="emailFrom" className="block text-lg font-medium text-gray-700">Participant Email:</label>
          <input type="text" name="email_from" id="emailFrom" className="mt-1 px-4 py-2 border border-gray-300 focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm rounded-md" placeholder="person@example.com"/>
        </div>

        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Send
        </button>
      </form>
      {feedback && <p className="mt-4 text-gray-600">{feedback}</p>}

      <div className="mt-8">
        {Object.entries(emailTokenMap).map(([email, token]) => (
          <p key={email} className="text-sm text-gray-600">{email}: {String(token)}</p>
        ))}
      </div>
    </div>
  );
}

export default App;
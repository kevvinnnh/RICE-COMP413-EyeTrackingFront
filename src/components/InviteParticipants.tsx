import * as React from 'react';
import emailjs from '@emailjs/browser';
import { HOSTNAME } from '../HostName.tsx'


function App() {
  const [feedback, setFeedback] = React.useState('');
  const [message, setMessage] = React.useState(''); // State to hold the custom message

  // Function to generate a random token
  const generateToken = (): string => {
    return Math.random().toString(36).substring(2, 15);
  };

  // Function to handle sending email
  const sendEmail = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    const newToken = generateToken(); // Generate a new token
    console.log('Generated Token:', newToken); // Debugging log
  
    const email = e.currentTarget.email_from.value; // Assuming your input's name attribute is 'email_from'
    console.log('Email:', email); // Debugging log
  
  
    // Attempt to find an existing token input element
    const hiddenTokenInput = e.currentTarget.querySelector('input[name="token"]') as HTMLInputElement | null;
  
    if (hiddenTokenInput) {
      hiddenTokenInput.value = newToken;
    } else {
      const tokenInput = document.createElement("input");
      tokenInput.type = "hidden";
      tokenInput.name = "token";
      tokenInput.value = newToken;
      e.currentTarget.appendChild(tokenInput);
    }
  
    // Send the form with EmailJS
    emailjs.sendForm('service_tf822zh', 'template_jsbrfn9', e.currentTarget, 'AfSmL--5Xp1qfkypO')
      .then((result) => {
        console.log('Email successfully sent', result);
        setFeedback('Email sent successfully.');
      }, (error) => {
        console.error('Failed to send email', error);
        setFeedback('Failed to send email. Please try again later.');
      });


          // First, store the invite in the backend
    try {
      const storeInviteResponse = await fetch(`${HOSTNAME}/api/store_invite`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({
              email: email,
              token: newToken,
          }),
      });

      const storeInviteResult = await storeInviteResponse.json();

      if (!storeInviteResponse.ok) {
          throw new Error(storeInviteResult.error || 'Failed to store invite');
      }

      console.log('Invite Stored:', storeInviteResult); // Debugging log
  } catch (error) {
      console.error('Error storing invite:', error);
      setFeedback('Failed to store invite. Please try again later.');
      return; // Ensure we don't attempt to send an email if storing the invite failed
  }
  
  };

  return (
    <div className="App min-h-screen flex flex-col justify-center items-center bg-white font-inter">
      <h1 className="text-4xl font-bold mb-6 text-gray-800">Invite Participant</h1>
      <form className="w-full max-w-md space-y-5" onSubmit={sendEmail}>
        <div>
          <label htmlFor="emailFrom" className="block text-lg font-medium text-gray-700">Participant Email:</label>
          <input type="text" name="email_from" id="emailFrom" className="mt-1 px-4 py-2 border border-gray-300 focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm rounded-md" placeholder="email@domain.com"/>
        </div>

        {/* Hidden input for the token (initially not in the DOM) */}
        <input type="hidden" name="token" />

        {/* Input field for the custom message */}
        <div>
          <label htmlFor="customMessage" className="block text-lg font-medium text-gray-700">Message:</label>
          <textarea name="message" id="customMessage" className="mt-1 px-4 py-2 border border-gray-300 focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm rounded-md" placeholder="Enter your message here" onChange={(e) => setMessage(e.target.value)} value={message}/>
        </div>

        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Send
        </button>
      </form>
      {feedback && <p className="mt-4 text-gray-600">{feedback}</p>}
    </div>
  );
}

export default App;
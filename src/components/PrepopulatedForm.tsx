// PrepopulatedForm.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HOSTNAME } from '../HostName.tsx'

const PrepopulatedForm = () => {
    // Assume there's a state to manage form responses, etc.
    const [responses, setResponses] = useState<any>({});
    const navigate = useNavigate();

    // Function to handle form submission
    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        // You would handle form submission here
        // For example, POST to backend
        try {
            const response = await fetch(`${HOSTNAME}/api/responses`, {
                
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(responses),
            });
        
        if (response.ok) {
            console.log('Responses submitted successfully');
            // Navigate back to the home page or to a success page
            navigate('/success-page');
        } else {
            console.error('Failed to submit responses');
        }
        } catch (error) {
        console.error('Network error when trying to submit responses:', error);
        }

    // Handlers for updating the state based on form inputs, etc.
    return (
        <form onSubmit={handleSubmit}>
        {/* Your form inputs and labels go here */}
        {/* ... */}
        <button type="submit" className="...">
            Submit Responses
        </button>
        </form>
    );
    };
    return (
        <div className="max-w-4xl mx-auto p-4">
        <h1 className="text-2xl font-semibold mb-4">Welcome to our survey</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="bg-white border-[1px] rounded-lg p-2 flex flex-col w-full">
                {/* Consistent styling with EditFormQuestion.tsx */}
                <label className="text-sm font-medium text-gray-700">
                    Please select your role:
                    <select name="role" className="p-2.5 text-sm border-[0px] bg-gray-100 rounded-md w-full">
                    <option value=""></option> 
                    <option value="physician">Physician</option>
                    <option value="staff">Staff</option>
                    <option value="admin">Admin</option>
                    </select>
                </label>
            </div>
        {/* Experience Level question */}
        <div className="bg-white border-[1px] rounded-lg p-2 flex flex-col w-full">
            <label className="text-sm font-medium text-gray-700">Experience Level:</label>
            <select name="experienceLevel" className="p-2.5 text-sm border-[0px] bg-gray-100 rounded-md w-full">
                <option value=""></option> 
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
                <option value="expert">Expert</option>
            </select>
        </div>

        {/* Demographic questions */}
        {/* Age question */}
        <div className="bg-white border-[1px] rounded-lg p-2 flex flex-col w-full mb-4">
            <label className="text-sm font-medium text-gray-700">
                What is your age?
                <input type="number" name="age" className="form-input mt-1 block w-full" placeholder="Enter your age" />
            </label>
        </div>

        {/* Gender question */}
        <div className="bg-white border-[1px] rounded-lg p-2 flex flex-col w-full mb-4">
            <label className="text-sm font-medium text-gray-700">
                What is your gender?
                <select name="gender" className="form-select mt-1 block w-full">
                    <option value=""></option> 
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                    <option value="preferNotToSay">Prefer not to say</option>
                </select>
            </label>
        </div>

        {/* Vision conditions question */}
        <div className="bg-white border-[1px] rounded-lg p-2 flex flex-col w-full mb-4">
            <fieldset>
                <legend className="text-sm font-medium text-gray-700">
                    Do you have any vision conditions?
                </legend>
                <label className="inline-flex items-center">
                    <input type="checkbox" name="visionImpairment" className="form-checkbox" />
                    <span className="ml-2">Yes</span>
                </label>
                <label className="inline-flex items-center">
                    <input type="checkbox" name="visionImpairment" className="form-checkbox" />
                    <span className="ml-2">No</span>
                </label>
            </fieldset>
        </div>

        {/* Skin Lesion Diagnosis Questions*/}
        {/* Question 1 */}
        <div className="bg-white border-[1px] rounded-lg p-2 flex flex-col w-full mb-4">
        <label className="text-sm font-medium text-gray-700">
            1. What is the diagnosis for this skin lesion on the individual’s <em>back</em>?
        </label>
        <img
            // Replace with your path to image file 
            src="\default_survey_images\ISIC_0034539_1.jpg"
            className="my-4"
        />
        <div className="flex flex-col">
            <label className="inline-flex items-center">
            <input type="radio" name="diagnosis" value="benignKeratosis" className="form-radio" />
            <span className="ml-2">Benign keratosis-like lesions</span>
            </label>
            <label className="inline-flex items-center">
            <input type="radio" name="diagnosis" value="dermatofibroma" className="form-radio" />
            <span className="ml-2">Dermatofibroma</span>
            </label>
            <label className="inline-flex items-center">
            <input type="radio" name="diagnosis" value="melanoma" className="form-radio" />
            <span className="ml-2">Melanoma</span>
            </label>
            <label className="inline-flex items-center">
            <input type="radio" name="diagnosis" value="melanocyticNevi" className="form-radio" />
            <span className="ml-2">Melanocytic nevi</span>
            </label>
        </div>

         {/* Question 2 */}
         <div className="bg-white border-[1px] rounded-lg p-2 flex flex-col w-full mb-4">
        <label className="text-sm font-medium text-gray-700">
            2. What is the diagnosis for this skin lesion on the individual’s <em>abdomen</em>?
        </label>
        <img
            // Replace with your path to image file 
            src="\default_survey_images\ISIC_0034525_2.jpg"
            className="my-4"
        />
        <div className="flex flex-col">
            <label className="inline-flex items-center">
            <input type="radio" name="diagnosis" value="melanocyticNevi" className="form-radio" />
            <span className="ml-2">Melanocytic nevi</span>
            </label>
            <label className="inline-flex items-center">
            <input type="radio" name="diagnosis" value="benignKeratosis" className="form-radio" />
            <span className="ml-2">Benign keratosis-like lesions</span>
            </label>
            <label className="inline-flex items-center">
            <input type="radio" name="diagnosis" value="vascularLesions" className="form-radio" />
            <span className="ml-2">Vascular lesions</span>
            </label>
            <label className="inline-flex items-center">
            <input type="radio" name="diagnosis" value="basalCellCarcinoma" className="form-radio" />
            <span className="ml-2">Basal cell carcinoma</span>
            </label>
        </div>

        {/* Question 3 */}
        <div className="bg-white border-[1px] rounded-lg p-2 flex flex-col w-full mb-4">
        <label className="text-sm font-medium text-gray-700">
            3. What is the diagnosis for this skin lesion on the individual’s <em>back</em>?
        </label>
        <img
            // Replace with your path to image file 
            src="\default_survey_images\ISIC_0034526_3.jpg"
            className="my-4"
        />
        <div className="flex flex-col">
            <label className="inline-flex items-center">
            <input type="radio" name="diagnosis" value="benignKeratosis" className="form-radio" />
            <span className="ml-2">Benign keratosis-like lesions</span>
            </label>
            <label className="inline-flex items-center">
            <input type="radio" name="diagnosis" value="basalCellCarcinoma" className="form-radio" />
            <span className="ml-2">Basal cell carcinoma</span>
            </label>
            <label className="inline-flex items-center">
            <input type="radio" name="diagnosis" value="vascularLesions" className="form-radio" />
            <span className="ml-2">Vascular lesions</span>
            </label>
            <label className="inline-flex items-center">
            <input type="radio" name="diagnosis" value="dermatofibroma" className="form-radio" />
            <span className="ml-2">Dermatofibroma</span>
            </label>
        </div>
        </div></div>
                <button type="submit" className="mt-4 bg-gradient-to-tr from-blue-600 to-blue-400 text-white font-bold text-lg py-2 px-4 rounded transition duration-300 ease-in-out transform hover:translate-x-1 hover:shadow-lg">
                    Submit Responses
                </button>
            </div>
        </form>
    </div>
);
};

export default PrepopulatedForm;

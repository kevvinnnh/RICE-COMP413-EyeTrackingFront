# RICE-COMP413-EyeTrackingFront
EpiDerm Tracker is an innovative tool designed to enhance diagnostic accuracy in dermatology by leveraging classifcation models and eye-tracking technology. It enables the precise recording of practitioner gaze patterns during skin examination, generating comprehensive heatmaps and skill level classifications. The platform facilitates tailored training programs for dermatology residents, aiming to refine diagnostic skills and reduce the incidence of misdiagnosis. With EpiDerm Tracker, we strive to improve patient outcomes and enhance education and evaluation processes in dermatology.

This repository contains the frontend code for a web-based survey application. The frontend utlizies react, typescript, and html/css and is responsible for building the web page, and displaying data to the users, as well as sending form data to the backend. This repository works along with the backend repository and a mongoDB database. Our final work is on the `master` branch.

**Users:**

Admin: Manages user accounts, system settings, and oversees platform operation.

Survey Creators: Design and create surveys, analyze generated data.

Dermatology Residents: Participate in surveys, contribute valuable data for training and assessment.

**to run the application:**

1. ensure you already have the backend runnning: https://github.com/kevvinnnh/RICE-COMP413-EyeTrackingBack/blob/auth/README.md
2. ensure that you have received unique login credentials from EpiDerm Tracker, as that is the only way you will be able to login to the application.
3. ensure you have the latest version of python installed.
4. clone this repo and checkout the `master` branch (`git checkout -b master`)
5. `pip install -r requirements.txt` to install all of the requirements and dependencies.
6. `npm run dev` should start up the frontend in a simoultaneous terminal as the backend is running. 
7. open the produced link to navigate to the login page with credentials provided from EpiDerm 


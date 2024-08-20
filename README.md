# 🏥 Doc-Book

**Doc-Book** is a web application designed for a doctor's clinic where the admin and doctor's secretary can create appointment slots. Patients can book these slots, and doctors can view their scheduled appointments. It's an all-in-one solution to manage clinic appointments efficiently.

## 🚀 Getting Started

### Prerequisites

Ensure you have **Node.js** and **npm** installed on your system. You can download them from [Node.js official website](https://nodejs.org/).

### Steps to Get the Repository

1. **Clone the Repository**  
   Open your terminal or command prompt, navigate to your desired directory, and run the following command:
   ```bash
   git clone <repo-url>
Navigate to the Folder
Once the repository is cloned, navigate to the folder containing both the client and server files:
bash
Copy code
cd doc-book
🖥️ Server Setup
Navigate to the server folder:

bash
Copy code
cd server
Download the necessary npm packages:

bash
Copy code
npm install@latest
Create a .env file in the server folder and add the following environment variables:

MONGO_URI
JWT_SECRET
JWT_LIFETIME
TWILIO_ACCOUNT_SID (optional, if using Twilio for SMS service)
If you want to use Twilio's SMS service, refer to the Twilio Documentation and add these variables to your .env file as well:

TWILIO_PHONE_NUMBER
TWILIO_AUTH_TOKEN
Start the server using the command:

bash
Copy code
npm start
Refer to the app.js file to see all the server routes.

📂 Server Folder Structure
The server folder is organized as follows:

db - Contains the database connection.
Models - Contains all the table schemas.
Controllers - Contains all the logic behind the routes.
Routes - Contains all the API routes.
app.js - Connects and implements API routes.
🖥️ Client Setup
Navigate to the client folder:

bash
Copy code
cd client
Download the necessary npm packages:

bash
Copy code
npm install@latest
Start the client server using the command:

bash
Copy code
npm start
Refer to the App.js file to see all the client routes.

📂 Client Folder Structure
The client folder (within the src directory) is organized as follows:

Pages - Contains all the JavaScript files for different pages.
Components - Contains modular components used throughout the project.
🔐 OTP Login Feature
To use the OTP login functionality, make sure to utilize the handleGetOTP function located in the /client/src/Pages folder instead of the standard handleLogin function, which does not utilize Twilio OTP.

📸 Screenshots
Here are some screenshots of the application:

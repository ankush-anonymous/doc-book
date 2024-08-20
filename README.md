# doc-book
A WebApp for a doctor's clinic where admin and Doctor's secretary can create slots and patient's can book slot and doctor can see their booked appointments

## 🚀 Getting Started

### Prerequisites

Make sure you have **Node.js** and **npm** installed on your system. You can download them from [Node.js official website](https://nodejs.org/).

### Steps to Get the Repository

1. **Clone the Repository**  
   Navigate to your desired directory and run the following command in your terminal or command prompt:
   
bash
   git clone <repo-url>

2. Navigate to the Folder
Once the repository is cloned, you can navigate to the folder containing both the client and server files.

## **🖥️ Server Setup** </br></br>
Navigate to the server folder:
bash
     cd server
  
Download the necessary npm packages:
bash
      npm install@latest
  
Create a
.env
file which contains
  MONGO_URI
  JWT_SECRET
  JWT_LIFETIME
  TWILIO_ACCOUNT_SID 
  </br>
(Note: if you want to use Twilio sms service refer to twilio docs: https://www.twilio.com/docs & add these variables too.
  TWILIO_PHONE_NUMBER 
  TWILIO_PHONE
)
 
Start the server using the command:
bash
      npm start
  
**Refer to ``app.js`` file to see all the server routes.

  ***📂Folder Structure***</br></br>
  There are 4 main folder and app.js file:
  1. db - Contains the database connection.
  2. Models - Contains all the table schemas.
  3. Controllers - Contains all the logic behind the routes.
  4. Routes - Contains all the API routes.
  5. app.js - Connects and implements API routes.


## **🖥️ Client Setup**</br></br>
Navigate to the downloaded folder:
bash
     cd <Folder_name>
  
Download the necessary npm packages:
bash
      npm install@latest
  
Start the client server using the command:
bash
      npm start
  
**Refer to ``App.js`` file to see all the client routes.

 ***📂Folder Structure***</br></br>
  The client folder (within the src directory) is organized as follows:
  1. Pages - Contains all the JavaScript files for different pages.
  2. Components - Contains modular components used throughout the project.

Note:  To use OTP Login function
handleGetOTP
function in /client/src/Pages folder instead of
handleLogin
which doesn't use twilio OTP

</br></br>
## 📸 Screenshots</br>
Here are some screenshots of the application:



get me this in more refined manner but in readme format for mt git repo

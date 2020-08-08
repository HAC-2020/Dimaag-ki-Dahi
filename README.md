# Zoom online lecture attendance automation (ZOLAA)

Since working and studying at home has become the new normal, many organizations and educational institutions are having a hard time adapting to remote culture. 

This project aims to simplify and automate one of the tasks in online teaching, which is the time-consuming process of taking attendance. Besides being tedious, taking online attendance is a problem because many students join anonymously, which adds to the hassle of the teacher. The project also aims to enforce joining using their roll number, otherwise the attendance will not be considered in further processing. 

**DISCLAIMER: ATTENDANCE IS ONLY CONSIDERED TO BE A FUNCTION OF THE TIME THE STUDENT WAS PRESENT IN THE MEETING. THE TEACHER IS ALSO GIVEN THE AUTHORITY TO OVERRIDE ANY DISCREPANCY IN THE ATTENDANCE.**

#### Technology used:
* Zoom meeting events API
* NodeJS for the backend
* MongoDB as database

#### Prerequisites for local setup
* NodeJS
* MongoDB
* Ngrok for hosting

#### Steps for setup(for meeting hosts)
* Clone this repository and run the project using `npm start`.
* Expose port 3000 to the internet using ngrok. Copy the link. 
* Create a Zoom app on your account(webhook only). Add event subscriptions and subscribe to the following events: 
    * Meeting started
    * Meeting ended
    * Participant joined
    * Participant left
* In the *Event notification endpoint URL* add the above link.
* Now logging is enabled. Make sure you run the server and update the endpoint everytime you restart ngrok. 
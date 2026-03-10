# Parking-Payment-System
## Overview
The Parking Payment System provides a simple platform for users to manage parking payments online. Users can create an account, log in securely, calculate parking fees, and submit payment information. The system stores user and payment data in a database and ensures secure access through authentication and authorization.

This project was developed as part of a web development course and focuses on implementing core full-stack development concepts.

## Features
- User registration and login system
- Secure authentication and authorization
- Parking fee calculation based on time
- Payment submission and record storage
- User session management
- Dynamic web pages rendered from the server

## Tech Stack
Frontend
- HTML
- CSS
- JavaScript

Backend
- Node.js
- Express

Database
- MongoDB

Other Tools
- dotenv (environment variable management)
- npm (package management)

## System Architecture
The application follows a simple MVC-style architecture.

Flow:
- User → Browser → Express Server → Database

Workflow:
- 1 User interacts with the website through a browser
- 2 Requests are sent to the Express server
- 3 The server processes the request and communicates with the database
- 4 Data is returned and rendered to the user interface

## API Endpoints
| Method | Endpoint | Description |
|------|------|------|
| GET | /login | login page |
| POST | /login | authenticate user |
| GET | /dashboard | user dashboard |
| POST | /pay | submit parking payment |

## Installation

Clone the repository:
- git clone https://github.com/shangc1997/Parking-Payment-System.git

Navigate into the project directory:
- cd Parking-Payment-System

Install dependencies:
- npm install

Create environment variables:
- cp .env.example .env

Edit the .env file and configure your database connection

Start the server:
- npm start

Open your browser and visit:
- http://localhost:3000

## Future Improvements
- Integrate real online payment services (Stripe or PayPal)
- Add parking space availability tracking
- Improve UI design and responsiveness
- Add parking history analytics for users

## Learning Outcomes
Through this project, the following concepts were practiced:

- Full-stack web application development
- Backend API development using Express
- Authentication and session management
- Database integration
- Dynamic page rendering with EJS

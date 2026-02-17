# Music App API (Backend)

This is the backend server for the music application.
It provides a RESTful API that handles authentication, playlist management, user data, and secure communication with the database.
The server is responsible for enforcing data ownership, validating requests, and persisting user-generated content while integrating seamlessly with the React frontend.

# Overview

The API allows authenticated users to:
Create and manage playlists

Add and remove tracks from playlists

Delete playlists

Retrieve their personal playlist collection

All routes are protected and scoped to the currently logged-in user to ensure data security and proper ownership.

# Technologies Used

Node.js – Runtime environment

Express – Server and routing

MongoDB – NoSQL database

Mongoose – Schema modeling and validation

JWT / Express middleware – Authentication & protected routes

dotenv – Environment variable management

CORS – Cross-origin request handling

Morgan (optional) – Request logging



# Data Models
### User Model
Defines:
username

email

hashed password

timestamps

Used for authentication and ownership of playlists.

### Playlist Model
Defines:
name (required)

img (required)

owner (reference to User)

tracks (array of track objects)

Each track object can store:
trackId

title

artist

artwork

Genre

Description

Duration

StreamUrl

permalink

# Authentication Flow
User logs in from the frontend

Server validates credentials

A JWT is generated and returned

The token is sent with future requests

Protected routes verify the token and attach the user to the request

This ensures:
Only authenticated users can access the API

Users can only modify their own playlists

# API Endpoints
### Auth Routes
#### POST /auth/signup
- Create a new user.
#### POST /auth/login
- Authenticate a user and return a token.

### Playlist Routes
- All playlist routes require a valid JWT.
#### GET /playlists
- Returns all playlists for the logged-in user.
#### GET /playlists/:id
- Returns a single playlist owned by the user.
#### POST /playlists
- Creates a new playlist.
- Request Body:
 {
"name": "Workout Mix"
}

#### PUT /playlists/:id
- Updates a playlist.
- Used to:
- Add a track
- Remove a track
- Rename playlist

#### DELETE /playlists/:id
- Deletes a playlist owned by the user.

# Key Backend Features
### Ownership Enforcement
Every playlist is filtered by the authenticated user’s ID before any operation is performed.
This prevents:
Unauthorized access

Editing another user’s playlists

Deleting another user’s data

### Request Validation
Mongoose schemas enforce required fields and proper data structure.
Invalid requests return meaningful error messages to the client.

### Token-Based Route Protection
A custom middleware:
Extracts the JWT

Verifies it

Attaches the user to req.user

This keeps protected route logic clean and reusable.

### Scalable MVC Structure
Separating models, controllers, and routes:
Improves maintainability

Makes debugging easier

Allows future expansion

# Challenges & Solutions
### Protecting User Data
Solved by always querying playlists with:
owner: req.user.\_id

### Updating Nested Track Arrays
Used MongoDB update operators and Mongoose document methods to efficiently add and remove tracks without overwriting the entire playlist.

### Token Persistence Across Requests
Implemented middleware to automatically verify tokens for all protected routes.

# Future Improvements
Role-based authorization

Public playlists endpoint

Playlist collaboration support

Caching for faster playlist retrieval

Unit and integration testing

API documentation with Swagger

# Running the Project Locally
1️⃣ Install dependencies
npm install

2️⃣ Set up environment variables
Create a .env file:
PORT=3000
MONGODB_URI=your_database_url
JWT_SECRET=your_secret

3️⃣ Start the server
npm run dev

# Author
### Jullian Guerrero
### JimmieAlice Williams
### Richard Casares
GitHub: (your link)

🧠 Reflections
Building this backend strengthened our understanding of secure API design, especially around authentication, protected routes, and enforcing data ownership at the database query level.
The most important takeaway was learning how to structure a scalable Express application using the MVC pattern while keeping controllers focused, middleware reusable, and models responsible for validation.
This project mirrors real-world backend architecture and provides a strong foundation for building production-ready APIs.

# Chatify


Chatify is a modern, full-stack real-time messaging application designed for seamless communication. It allows users to sign up, log in, connect with other users, and engage in private conversations. The application features a sleek and responsive user interface, secure authentication, and a robust backend.

## Tech Stack

### Backend
- **Framework:** Node.js, Express.js
- **Database:** MongoDB with Mongoose
- **Authentication:** JSON Web Tokens (JWT) & bcrypt.js
- **Image Storage:** Cloudinary for profile pictures
- **Email Service:** Resend for sending welcome emails
- **Security:** Arcjet for rate limiting and bot detection

### Frontend
- **Library:** React
- **Build Tool:** Vite
- **Styling:** Tailwind CSS & DaisyUI
- **State Management:** Zustand
- **Routing:** React Router
- **HTTP Client:** Axios

## Features

- **Secure User Authentication:** Robust signup, login, and logout functionality using JWT-based sessions.
- **Profile Customization:** Users can upload and update their profile pictures, which are seamlessly handled by Cloudinary.
- **Real-time Chat:** Engage in one-on-one conversations with other registered users.
- **Contact & Chat Management:** Easily switch between a list of all available contacts and your active chat conversations.
- **Welcome Emails:** New users receive a beautiful, HTML-formatted welcome email powered by Resend.
- **Security First:** Implements protected routes and leverages Arcjet security middleware to prevent abuse from rate-limiting and bot attacks.
- **Modern & Responsive UI:** A clean, intuitive interface built with Tailwind CSS and DaisyUI, featuring animated components and loading skeletons for a smooth user experience.
- **Efficient State Management:** Utilizes Zustand for simple and powerful global state management on the client-side.

## Getting Started

Follow these steps to set up and run the project locally.

### Prerequisites

- Node.js (v20.0.0 or higher)
- npm (or a compatible package manager like yarn or pnpm)
- MongoDB instance (local or a cloud service like MongoDB Atlas)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/1-manish/Chatify.git
    cd Chatify
    ```

2.  **Set up Environment Variables:**
    Create a `.env` file in the `backend/` directory. Copy the variables below and replace the placeholder values with your actual credentials.

    ```env
    # backend/.env

    PORT=3000
    NODE_ENV=development
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_super_secret_jwt_key
    CLIENT_URL=http://localhost:5173 replace with where u host project
    RESEND_API_KEY=your_resend_api_key
    EMAIL_FROM=your_sender_email@example.com
    EMAIL_FROM_NAME=ChatifyApp
    CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
    CLOUDINARY_API_KEY=your_cloudinary_api_key
    CLOUDINARY_API_SECRET=your_cloudinary_api_secret
    ARCJET_KEY=your_arcjet_sdk_key
    ```

3.  **Install Dependencies:**
    The root `package.json` is configured to install dependencies for both the backend and frontend simultaneously.
    ```bash
    npm install
    ```

### Running the Application

**Development Mode:**
To run both the frontend and backend servers with hot-reloading:

1.  Start the backend server:
    ```bash
    npm run dev --prefix backend
    ```

2.  In a new terminal, start the frontend server:
    ```bash
    npm run dev --prefix frontend
    ```
    The application will be available at `http://localhost:5173`.

**Production Mode:**
To build the application for production and run the server:

1.  Build the frontend and install all dependencies:
    ```bash
    npm run build
    ```

2.  Start the production server. This will serve both the backend API and the optimized frontend static files.
    ```bash
    npm start
    ```

## API Endpoints

All endpoints are prefixed with `/api`.

### Authentication (`/auth`)

-   `POST /signup`: Create a new user account.
-   `POST /login`: Log in an existing user and set an HTTP-only cookie.
-   `POST /logout`: Log out the current user and clear the session cookie.
-   `PUT /update-profile`: (Protected) Update the user's profile picture.
-   `GET /check`: (Protected) Verify the current user's authentication status using the session cookie.

### Messaging (`/messages`)

*Note: All messaging routes are protected and require authentication.*

-   `GET /contacts`: Get a list of all registered users (contacts).
-   `GET /chats/partner`: Get a list of users with whom the current user has an active conversation.
-   `GET /:id`: Get all messages between the current user and the user with the specified `:id`.
-   `POST /send/:id`: Send a message to the user with the specified `:id`.

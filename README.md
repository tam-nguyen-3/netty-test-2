# Netty

A professional networking assistant that helps users connect with relevant people based on their profile and specific queries.

## 📋 Overview

Netty is a modern web application that leverages AI to facilitate meaningful professional connections. The app uses contextual understanding and similarity matching to suggest relevant profiles to users based on their queries and profile information.

## 🚀 Features

- **AI-Powered Chat Interface**: Engage with an intuitive chat interface that understands natural language queries
- **Smart Profile Matching**: Get suggested connections based on your profile and specific networking needs
- **Context-Aware Recommendations**: The system analyzes both query content and user profiles for relevant matches
- **User Authentication**: Secure login and user management

## 🏗️ Tech Stack

### Frontend

- React 19 with TypeScript
- Vite for fast development and building
- TailwindCSS for styling
- Shadcn UI component library
- React Router for navigation

### Backend

- Node.js with Express
- MongoDB for data storage
- Google Generative AI (Gemini) for natural language processing
- JWT for authentication

## 🛠️ Project Structure

```
netty/
├── frontend/               # React frontend application
│   ├── src/                # Source code
│   │   ├── components/     # Reusable UI components
│   │   ├── services/       # API service clients
│   │   ├── types/          # TypeScript type definitions
│   │   └── hooks/          # Custom React hooks
└── backend/                # Node.js backend server
    ├── controllers/        # Request handlers
    ├── models/             # MongoDB schema models
    ├── routes/             # API route definitions
    └── helper.js           # Utility functions
```

## 🚧 Installation & Setup

### Prerequisites

- Node.js (v16+)
- MongoDB
- Google AI API key

### Backend Setup

1. Clone the repository
2. Navigate to the backend directory:
   ```
   cd backend
   ```
3. Install dependencies:
   ```
   npm install
   ```
4. Create a `.env` file with your environment variables:
   ```
   MONGO_URI=your-mongodb-connection-string
   GOOGLE_API_KEY=your-google-ai-api-key
   JWT_SECRET=your-jwt-secret
   ```
5. Start the development server:
   ```
   npm run dev
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```
   cd frontend
   ```
2. Install dependencies:
   ```
   npm install
   ```
3. Start the development server:
   ```
   npm run dev
   ```

## 🧪 Running Tests

```
cd backend
npm test
```

## 🔄 API Endpoints

- **POST /auth/register**: Register a new user
- **POST /auth/login**: Authenticate a user
- **POST /chat**: Process a chat query and return suggestions
- **GET /history/:userId**: Retrieve chat history for a user

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is licensed under the MIT License.

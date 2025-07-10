Kaseddie AI - Intelligent Crypto Trading Platform
Live Demo: https://kaseddie-crypto-ai.netlify.app/

Overview
Kaseddie AI is a next-generation cryptocurrency trading platform designed to democratize sophisticated trading for the everyday user. The platform leverages a proprietary AI engine to provide actionable market insights, automated trading strategies, and a seamless user experience through a conversational UI and voice commands.

This project is built with a focus on performance, security, and scalability, utilizing the Starknet Layer 2 network to ensure low-cost, high-speed transactions.

✨ Key Features
AI-Powered Trading: Access 10+ advanced, back-tested trading strategies (Momentum, Arbitrage, Sentiment Analysis, etc.).

Conversational Interface: Interact with the platform using natural language through the integrated AI Chat Assistant.

Voice Commands: Execute trades, request market analysis, and manage your portfolio using your voice.

Starknet Integration: Connect your ArgentX or Braavos wallet for secure, on-chain operations.

Multi-Platform Support: A unified backend serves our web, desktop, and mobile applications.

Real-Time Market Data: Live price feeds and analytics for over 50 cryptocurrencies.

🛠️ Tech Stack
Frontend: HTML5, CSS3, Vanilla JavaScript

Blockchain Integration: Starknet.js for wallet connectivity and on-chain interaction.

Backend: Node.js, Express.js (for handling API requests and AI logic).

AI/ML: Custom logic for pattern matching and intent recognition in the demo; designed for expansion with full ML models.

🚀 Deployment
The Kaseddie AI platform is architected with a decoupled frontend and backend for maximum scalability and flexibility.

Frontend Deployment:

The static web application is deployed on Netlify. This ensures global CDN distribution, fast load times, and continuous deployment.

Live URL: https://kaseddie-crypto-ai.netlify.app/

Backend Deployment:

The Node.js server is deployed on Railway. This provides a robust, scalable server environment.

Live API Endpoint: https://kaseddie-crypto-production.up.railway.app/api

Deployment Files
For a successful deployment on Netlify, you only need the following two files in your project folder:

index.html: Contains all the HTML, CSS, and client-side JavaScript for the application.

netlify.toml: The configuration file that tells Netlify how to build, serve, and secure your site.

⚙️ Running Locally
To run the project on your local machine, you will need to run the frontend and backend separately.

1. Backend Server:

# Navigate to the server directory
cd /path/to/your/backend-folder

# Install dependencies
npm install

# Start the server
node server-clean.js
# The server will be running on http://localhost:3002

2. Frontend Application:

Simply open the index.html file in your web browser.

Important: Ensure the apiBase variable in the KaseddiePlatform class points to your local server (http://localhost:3002/api) for local development.
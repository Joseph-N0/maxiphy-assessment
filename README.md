# Maxiphy Assessment Project

## Prerequisites

- Node.js (v22.9 or higher)
- npm (v11 or higher)

## Setup

1. Clone the repository:
    ```
    git clone https://github.com/yourusername/maxiphy-assessment.git
    cd maxiphy-assessment
    ```

2. Install dependencies for both server and front-end:
    ```sh
    cd server
    npm install
    cd ../front
    npm install
    ```

3. **Create a `.env` file in the root directory of both the server and front-end:**

   - Follow the variables defined in `.env.example` and create a `.env` file for each:
   
   - For the server:
     ```sh
     cp server/.env.example server/.env
     ```

   - For the front-end:
     ```sh
     cp front/.env.example front/.env
     ```

   - Update the values inside `.env` files as needed. Below are the required environment variables:

     **Server `.env` variables:**
     ```plaintext
     NODE_ENV=development  # Set the environment (development, production) -- keep it as development
     PORT=5000  # Port for the server to run on

     JWT_ENCRYPT_KEY=""  # Generate base-64 encoded key - Key for encrypting JWT tokens
     JWT_SECRET_KEY=""  # Generate base-64 encoded key - Secret key for signing JWT tokens
     JWT_EXPIRATION_TIME="1h"  # JWT access token expiration time
     JWT_REFRESH_EXPIRATION_TIME="1d"  # JWT refresh token expiration time

     DATABASE_URL=""  # PostgreSQL database connection string
     ```

     **Front-end `.env` variables:**
     ```plaintext
     REACT_APP_API_URL=http://localhost:5000  # Backend API URL
     ```


## Running the Project

### Start the Server

    - Navigate to the server directory and start the server:
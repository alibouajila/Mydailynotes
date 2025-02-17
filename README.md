**My Daily Notes App**

### Introduction
My **Daily Notes App** is designed to help users organize their daily tasks, thoughts, and important reminders in a structured and efficient manner. This app provides a simple yet powerful interface where users can jot down their notes,access them and delete them anytime with ease.

### Key Features
1. **User Authentication**
   - Secure login and signup functionality
   - Password protection to keep notes private

2. **Note Management**
   - Create and delete notes seamlessly
   
### Technology Stack
- **Frontend:** React.js for a dynamic and responsive user interface
- **Backend:** Node.js with Express.js for server-side logic
- **Database:** MongoDB for secure and scalable data storage
- **Authentication:** JWT for user security
### Installation and Setup
1. Clone the repository:
   ```bash
   git clone https://github.com/alibouajila/Mydailynotes.git
   ```
2. Navigate to the project directory:
   ```bash
   cd Mydailynotes
   ```
3. Navigate to the server directory:
   ```bash
   cd server
   ```
4. Install dependencies:
   ```bash
   npm install
   ```
5. Start the backend server:
   ```bash
   npm start
   ```
6. Navigate to the client directory ( in a new terminal ):
   ```bash
   cd client
   ```
7. Install dependencies:
   ```bash
   npm install
   ```
8. Start the frontend server:
   ```bash
   npm start
   ```

### API Endpoints
- **User Authentication:**
  - `POST /register` - Register a new user
  - `POST /login` - Authenticate user and issue tokens
  - `POST /refresh-token` - Refresh access token
  - `POST /logout` - Logout user and clear refresh token

- **Notes Management:**
  - `POST /notes` - Create a new note
  - `GET /notes` - Retrieve all notes
  - `DELETE /notes/:id` - Delete a note

### Future Enhancements
- **AI-powered suggestions** for note organization and content categorization
- **Handwritten note recognition** using OCR technology
- **Collaboration features** for shared note-taking with other users

### Conclusion
My **Daily Note App** aims to be a simple yet powerful tool for managing daily tasks and notes efficiently. With a focus on usability, security, and accessibility, it provides a seamless experience for users who need an effective digital notebook for their everyday needs.


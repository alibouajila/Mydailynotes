import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api'; // Import the Axios instance
import { AuthContext } from '../context/AuthContext';
import Notes from '../components/Notes';
import './Home.css';

function Home() {
  const { isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [notes, setNotes] = useState([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    } else {
      // Fetch home data
      api.get('/home')
        .then((response) => setMessage(response.data.message))
        .catch(() => navigate('/login'));
  
      // Fetch notes
      api.get('/notes')
        .then((response) => setNotes(response.data.notes))
        .catch((error) => console.error('Error fetching notes:', error));
    }
  }, [isAuthenticated, navigate]);

  const handleCreateNote = async (e) => {
    e.preventDefault();
    if (!noteTitle || !noteContent) {
      alert('Please fill in both the title and content!');
      return;
    }
    try {
      const response = await api.post('/notes', { title: noteTitle, content: noteContent });
      setNotes((prevNotes) => [...prevNotes, response.data.note]);
      alert(response.data.message);
      setNoteTitle('');
      setNoteContent('');
      setShowModal(false);
    } catch (error) {
      console.error('Error creating note:', error);
      alert('An error occurred while creating the note.');
    }
  };

  const handleDeleteNote = async (noteId) => {
    try {
      const response = await api.delete(`/notes/${noteId}`);
      if (response.status === 200) {
        alert(response.data.message);
        setNotes((prevNotes) => prevNotes.filter((note) => note._id !== noteId));
      } else {
        alert('Failed to delete the note.');
      }
    } catch (error) {
      console.error('Error deleting note:', error);
      alert('An error occurred while deleting the note.');
    }
  };

  return (
    <div>
      <div id="notes-section">
        {notes.length === 0 ? (
          <p id="notemsg">You don't have any notes yet.</p>
        ) : (
          <Notes notes={notes} onDelete={handleDeleteNote} />
        )}
      </div>

      <button id="add-note-button" onClick={() => setShowModal(true)}>
        <span className="icon">+</span>
      </button>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Create a New Note</h3>
            <form onSubmit={handleCreateNote}>
              <input
                id="note-title"
                type="text"
                placeholder="Note Title"
                value={noteTitle}
                onChange={(e) => setNoteTitle(e.target.value)}
                required
              />
              <textarea
                id="note-content"
                placeholder="Note Content"
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                required
              ></textarea>
              <button type="submit" className="submit-btn">Create Note</button>
            </form>
            <button className="close-btn" onClick={() => setShowModal(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
import React from 'react';
import './Notes.css';
const Notes = ({ notes, onDelete }) => {
  return (
    <div className="notes-container">
      {notes.map((note) => (
        <div key={note._id} className="note-card"> 
          <h3>{note.title}</h3>
          <p>{note.content}</p>
          <button
            onClick={() => {
              console.log('Deleting note with ID:', note._id); 
              onDelete(note._id); 
            }}
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
};

export default Notes;

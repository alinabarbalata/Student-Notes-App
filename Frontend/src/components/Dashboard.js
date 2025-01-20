import React, { useState, useEffect } from 'react';
import './Dashboard.css';
import { useNavigate } from 'react-router-dom';


const Dashboard = () => {
  const [notes, setNotes] = useState([
    { id: 1, content: 'This is a note for WebTech...', discipline: 'WebTech' },
    { id: 2, content: 'This is a note for Multimedia...', discipline: 'Multimedia' },
  ]);
  const [newNote, setNewNote] = useState('');
  const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0, noteId: null });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [disciplines] = useState(['Multimedia', 'WebTech', 'Econometrics','OOP','Data Analysis']);
  const [selectedDiscipline, setSelectedDiscipline] = useState(''); 
  const [isSeeNotesClicked, setIsSeeNotesClicked] = useState(false); 
  const [editingNoteId, setEditingNoteId] = useState(null); 
  const [isForumClicked, setIsForumClicked] = useState(false); 
  const navigate = useNavigate();
  const handleSeeForumClick = () => {
    navigate('/forum'); 
  };

  const handleSaveNote = () => {
    if (newNote.trim() !== '') {
      if (selectedDiscipline) {
        if (editingNoteId !== null) {
          setNotes(notes.map((note) =>
            note.id === editingNoteId ? { ...note, content: newNote, discipline: selectedDiscipline } : note
          ));
        } else {
          setNotes([...notes, { id: notes.length + 1, content: newNote, discipline: selectedDiscipline }]);
        }
        setIsSeeNotesClicked(true);
      }
      setNewNote('');
      setEditingNoteId(null);
    }
  };

  const handleSaveDraft = () => {
    if (newNote.trim() !== '') {
      setNotes([...notes, { id: notes.length + 1, content: newNote, discipline: 'Drafts' }]);
      setIsSeeNotesClicked(true);
      setNewNote('');
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleRightClick = (e, noteId) => {
    e.preventDefault();
    setContextMenu({
      visible: true,
      x: e.pageX,
      y: e.pageY,
      noteId,
    });
  };

  const handleSeeNotesClick = () => {
    setIsSeeNotesClicked(true);
    setIsSidebarOpen(false);
  };

  const handleOptionClick = (action) => {
    if (action === 'delete') {
      setNotes(notes.filter((note) => note.id !== contextMenu.noteId));
    } else if (action === 'edit') {
      const noteToEdit = notes.find((note) => note.id === contextMenu.noteId);
      setNewNote(noteToEdit.content);
      setSelectedDiscipline(noteToEdit.discipline);
      setEditingNoteId(noteToEdit.id);
    }
    setContextMenu({ visible: false, x: 0, y: 0, noteId: null });
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.context-menu') && !e.target.closest('.note-card')) {
        setContextMenu({ visible: false, x: 0, y: 0, noteId: null });
      }
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <div className="dashboard-container">
      {/* Arrow Button */}
      <div
        className={`arrow-button ${isSidebarOpen ? 'open' : ''}`}
        onClick={toggleSidebar}
      >
        <span></span>
      </div>

      {/* Sidebar */}
      <div className={`sidebar-container ${isSidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">Options</div>
        <div className="sidebar-content">
          <select onChange={(e) => setSelectedDiscipline(e.target.value)} value={selectedDiscipline}>
            <option value="">Select Discipline</option>
            {disciplines.map((discipline, index) => (
              <option key={index} value={discipline}>
                {discipline}
              </option>
            ))}
          </select>
          <button onClick={handleSeeForumClick}>See Forum</button>
          <button onClick={handleSeeNotesClick}>See Notes</button>
        </div>
      </div>

      {/* Notes List */}
      <div className="notes-list">
        <h2>
          {isSeeNotesClicked
            ? selectedDiscipline
              ? `${selectedDiscipline} Notes`
              : 'Drafts'
            : 'Click "See Notes" to view your notes'}
        </h2>
        {isSeeNotesClicked && (
          <div>
            {notes
              .filter((note) => (selectedDiscipline ? note.discipline === selectedDiscipline : note.discipline === 'Drafts'))
              .map((note) => (
                <div
                  key={note.id}
                  className="note-card"
                  onContextMenu={(e) => handleRightClick(e, note.id)}
                >
                  <p>{note.content}</p>
                </div>
              ))}
          </div>
        )}
      </div>

      {/* Create Note Section */}
      <div className="create-note-section">
        <div className="create-note-form">
          <textarea
            placeholder="Write your note here..."
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
          />
          <div className="save-as-container">
            <label>Save as: </label>
            <select
              onChange={(e) => setSelectedDiscipline(e.target.value)}
              value={selectedDiscipline}
            >
              <option value="">Select Discipline</option>
              {disciplines.map((discipline, index) => (
                <option key={index} value={discipline}>
                  {discipline}
                </option>
              ))}
            </select>

            <div className="save-buttons">
              <button onClick={handleSaveNote}>
                {editingNoteId ? 'Update Note' : 'Save Note'}
              </button>
              <button onClick={handleSaveDraft}>Save as Draft</button>
            </div>
          </div>
        </div>
      </div>

      {/* Context Menu */}
      {contextMenu.visible && (
        <div
          className="context-menu"
          style={{ top: contextMenu.y, left: contextMenu.x }}
        >
          <button onClick={() => handleOptionClick('edit')}>Edit</button>
          <button onClick={() => handleOptionClick('delete')}>Delete</button>
        </div>
      )}
    </div>
  );
};

export default Dashboard;

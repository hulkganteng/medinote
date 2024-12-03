import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [notes, setNotes] = useState([]);
  const [note, setNote] = useState({ title: '', note: '' });
  const [editing, setEditing] = useState(null);

  // Fetch notes from the backend
  useEffect(() => {
    axios.get('http://localhost:5000/api/notes')
      .then(response => setNotes(response.data))
      .catch(error => console.log(error));
  }, []);

  // Handle form submit for add or update
  const handleSubmit = (e) => {
    e.preventDefault();
    if (editing) {
      axios.put(`http://localhost:5000/api/notes/${editing.id}`, note)
        .then(response => {
          setNotes(notes.map(n => n.id === editing.id ? response.data : n));
          setEditing(null);
          setNote({ title: '', note: '' });
        })
        .catch(error => console.log(error));
    } else {
      axios.post('http://localhost:5000/api/notes', note)
        .then(response => {
          setNotes([...notes, response.data]);
          setNote({ title: '', note: '' });
        })
        .catch(error => console.log(error));
    }
  };

  // Handle editing of a note
  const handleEdit = (note) => {
    setEditing(note);
    setNote({ title: note.title, note: note.note });
  };

  // Handle deleting a note
  const handleDelete = (id) => {
    axios.delete(`http://localhost:5000/api/notes/${id}`)
      .then(() => {
        setNotes(notes.filter(n => n.id !== id));
      })
      .catch(error => console.log(error));
  };

  // Handle the 'Add New Note' button
  const handleAdd = () => {
    setEditing(null);
    setNote({ title: '', note: '' });
  };

  return (
    <div className="container py-5">
      <h1 className="text-center mb-4 text-primary">My Notes</h1>

      {/* Form for Adding and Editing Notes */}
      <form onSubmit={handleSubmit} className="mb-5">
        <div className="mb-3">
          <label htmlFor="title" className="form-label">Title</label>
          <input
            type="text"
            id="title"
            value={note.title}
            onChange={(e) => setNote({ ...note, title: e.target.value })}
            className="form-control"
            placeholder="Enter title"
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="note" className="form-label">Note</label>
          <textarea
            id="note"
            value={note.note}
            onChange={(e) => setNote({ ...note, note: e.target.value })}
            className="form-control"
            placeholder="Write your note here..."
            rows="4"
            required
          ></textarea>
        </div>
        <button type="submit" className="btn btn-primary w-100">
          {editing ? 'Update Note' : 'Add Note'}
        </button>
      </form>

      {/* Notes Table */}
      <div className="table-responsive">
        <table className="table table-striped table-bordered">
          <thead className="table-primary">
            <tr>
              <th>Title</th>
              <th>Note</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {notes.map((note) => (
              <tr key={note.id}>
                <td>{note.title}</td>
                <td>{note.note}</td>
                <td className="text-center">
                  <button
                    onClick={() => handleEdit(note)}
                    className="btn btn-sm btn-warning me-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(note.id)}
                    className="btn btn-sm btn-danger"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add New Note Button */}
      <div className="text-end mt-3">
        <button onClick={handleAdd} className="btn btn-success">
          Add New Note
        </button>
      </div>
    </div>
  );
}

export default App;

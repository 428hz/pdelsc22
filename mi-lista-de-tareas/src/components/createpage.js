import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function CreatePage({ onaddtask }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('incompleta');
  const navigate = useNavigate();

  const handlesubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('che, no te olvides del título.');
      return;
    }
    onaddtask({ title, description, status });
    navigate('/');
  };

  return (
    <div className="card">
      <div className="card-header">
        <h3>crear una nueva tarea</h3>
      </div>
      <div className="card-body">
        <form onSubmit={handlesubmit}>
          <div className="mb-3">
            <label htmlFor="title" className="form-label">título</label>
            <input
              type="text"
              className="form-control"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="description" className="form-label">descripción</label>
            <textarea
              className="form-control"
              id="description"
              rows="3"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>
          <div className="mb-3 form-check">
            <input
              type="checkbox"
              className="form-check-input"
              id="status"
              checked={status === 'completa'}
              onChange={(e) => setStatus(e.target.checked ? 'completa' : 'incompleta')}
            />
            <label className="form-check-label" htmlFor="status">¿está completa?</label>
          </div>
          <div className="d-flex justify-content-end">
             <Link to="/" className="btn btn-outline-secondary me-2">cancelar</Link>
             <button type="submit" className="btn btn-primary">agregar tarea</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreatePage;
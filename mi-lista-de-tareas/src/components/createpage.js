import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Swal from 'sweetalert2'; 
import withReactContent from 'sweetalert2-react-content'; 
const MySwal = withReactContent(Swal);

function CreatePage({ onaddtask }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('incompleta');
  const navigate = useNavigate();

  const handlesubmit = (e) => {
    e.preventDefault();

     if (title.trim().length < 2) {
     
      MySwal.fire({
        title: <p>¡upa!</p>,
        html: <p>el título es muy corto, che. ponele un poco más de onda.</p>,
        icon: 'warning',
        confirmButtonColor: '#0d6efd' 
      });
      return;
    }

    onaddtask({ title, description, status });
    navigate('/');
  };

  return (
    <div className="card border-0">
      <div className="card-header bg-transparent border-bottom-0 pt-3">
        <h3>crear una nueva tarea</h3>
      </div>
      <div className="card-body">
        <form onSubmit={handlesubmit} noValidate>
          <div className="mb-3">
            <label htmlFor="title" className="form-label">título</label>
            <input
              type="text"
              className="form-control"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              minLength="3"
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
              maxLength="200"
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
            <label className="form-check-label" htmlFor="status">marcar como completa</label>
          </div>
          <div className="d-flex justify-content-end gap-2">
             <Link to="/" className="btn btn-outline-secondary">cancelar</Link>
             <button type="submit" className="btn btn-primary d-flex align-items-center gap-2">
                <i className="bi bi-plus-lg"></i>
                agregar tarea
             </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreatePage;
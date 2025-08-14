import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

function EditPage({ tasks, onupdatetask }) {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [tasktoedit, setTaskToEdit] = useState(null);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('incompleta');

  useEffect(() => {
    const task = tasks.find(t => t.id === parseInt(id));
    if (task) {
      setTaskToEdit(task);
      setTitle(task.title);
      setDescription(task.description);
      setStatus(task.status);
    } else {
      navigate('/');
    }
  }, [id, tasks, navigate]);
  

  const handlesubmit = (e) => {
    e.preventDefault();
    if (title.trim().length < 3) {
      MySwal.fire({
        title: <p>¡upa!</p>,
        html: <p>el título es muy corto, che. ponele un poco más de onda.</p>,
        icon: 'warning',
        confirmButtonColor: '#0d6efd'
      });
      return;
    }
    onupdatetask(tasktoedit.id, { title, description, status });
    navigate(`/task/${tasktoedit.id}`);
  };

  if (!tasktoedit) {
    return <p>cargando tarea...</p>; 
  }

  return (
    <div className="card border-0">
      <div className="card-header bg-transparent border-bottom-0 pt-3">
        <h3>editando la tarea: "{tasktoedit.title}"</h3>
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
          
          <div className="mb-3">
            <label htmlFor="status" className="form-label">estado</label>
            <select 
              id="status" 
              className="form-select"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="incompleta">incompleta</option>
              <option value="en proceso">en proceso</option>
              <option value="completa">completa</option>
            </select>
          </div>
          
          <div className="d-flex justify-content-end gap-2">
             <Link to={`/task/${id}`} className="btn btn-outline-secondary">cancelar</Link>
             <button type="submit" className="btn btn-primary d-flex align-items-center gap-2">
                <i className="bi bi-save-fill"></i>
                guardar cambios
             </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditPage;
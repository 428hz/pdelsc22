// src/components/detailpage.js
import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';

function DetailPage({ tasks, ondeletetask }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const task = tasks.find(t => t.id === parseInt(id));

  const handledelete = () => {
    if (window.confirm('¿estás seguro de que querés borrar esta tarea?')) {
      ondeletetask(task.id);
      navigate('/');
    }
  };

  if (!task) {
    return (
      <div className="alert alert-danger text-center">
        <h4 className="alert-heading">¡ups!</h4>
        <p>parece que esa tarea no existe o ya fue borrada.</p>
        <hr />
        <Link to="/" className="btn btn-danger">volver al inicio</Link>
      </div>
    );
  }

  return (
    <div className="card border-0">
      <div className="card-header bg-transparent border-bottom-0 pt-3">
        <h3>detalle de la tarea</h3>
      </div>
      <div className="card-body">
        <h4 className="card-title">{task.title}</h4>
        <p className="card-text fs-5">{task.description}</p>
        <hr/>
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <span className="text-muted">estado: </span>
            <span className={`badge fs-6 ${task.status === 'completa' ? 'text-bg-success' : 'text-bg-warning'}`}>
              {task.status}
            </span>
          </div>
          <small className="text-muted">creada el: {task.createdate}</small>
        </div>
      </div>
      <div className="card-footer bg-transparent border-top-0 pb-3 d-flex justify-content-between">
        <Link to="/" className="btn btn-outline-secondary d-flex align-items-center gap-2">
          <i className="bi bi-arrow-left"></i> volver
        </Link>
        <button onClick={handledelete} className="btn btn-danger d-flex align-items-center gap-2">
          <i className="bi bi-trash-fill"></i> borrar
        </button>
      </div>
    </div>
  );
}

export default DetailPage;
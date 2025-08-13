// src/components/task.js
import React from 'react';
import { Link } from 'react-router-dom';

function Task({ task, ondeletetask }) {
  const shortdescription = task.description.length > 50 ? `${task.description.substring(0, 50)}...` : task.description;

  const handledelete = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm(`¿seguro que querés borrar la tarea "${task.title}"?`)) {
      ondeletetask(task.id);
    }
  };

  return (
    <Link to={`/task/${task.id}`} className="list-group-item list-group-item-action p-3">
      <div className="d-flex w-100 justify-content-between align-items-center">
        {/* sección del título y descripción */}
        <div className="flex-grow-1 me-3">
          <h5 className="mb-1">{task.title}</h5>
          <p className="mb-1 text-muted">{shortdescription}</p>
        </div>
        
        {/* sección del estado y botón de borrar */}
        <div className="d-flex align-items-center gap-3">
          <span className={`badge fs-6 ${task.status === 'completa' ? 'text-bg-success' : 'text-bg-warning'}`}>
            {task.status}
          </span>
          <button onClick={handledelete} className="btn btn-sm btn-outline-danger border-0" title="borrar tarea">
            <i className="bi bi-trash-fill fs-5"></i>
          </button>
        </div>
      </div>
    </Link>
  );
}

export default Task;
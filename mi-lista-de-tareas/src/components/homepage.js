import React from 'react';
import { Link } from 'react-router-dom';
import Task from './task';

// 1. acá le decimos que reciba la función
function HomePage({ tasks, ondownload, ondeletetask, ontogglestatus }) {
  return (
    <div>
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center mb-4">
        <h2 className="mb-3 mb-sm-0">mis tareas</h2>
        <div className="d-flex gap-2">
          <Link to="/create" className="btn btn-primary d-flex align-items-center gap-2">
            <i className="bi bi-plus-lg"></i>
            <span>crear</span>
          </Link>
          <button onClick={ondownload} className="btn btn-secondary d-flex align-items-center gap-2">
            <i className="bi bi-download"></i>
            <span>descargar</span>
          </button>
        </div>
      </div>
      <div className="list-group">
        {tasks.length > 0 ? (
          // 2. y acá se la pasamos a cada tarea hija
          tasks.map(t => <Task key={t.id} task={t} ondeletetask={ondeletetask} ontogglestatus={ontogglestatus} />)
        ) : (
          <div className="alert alert-info text-center">
            <i className="bi bi-check2-circle me-2"></i>
            ¡bárbaro! no tenés tareas pendientes.
          </div>
        )}
      </div>
    </div>
  );
}

export default HomePage;
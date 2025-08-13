import React from 'react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

function Task({ task, ondeletetask, ontogglestatus }) {
  const shortdescription = task.description.length > 50 ? `${task.description.substring(0, 50)}...` : task.description;

  const handledelete = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    MySwal.fire({
      title: `¿borrar "${task.title}"?`,
      text: "esta acción no se puede deshacer.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'sí, borrar',
      cancelButtonText: 'cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        ondeletetask(task.id);
      }
    });
  };

  const handletoggle = (e) => {
    // esta es la línea mágica que soluciona el problema
    e.stopPropagation();
    ontogglestatus(task.id);
  };

  return (
    <Link to={`/task/${task.id}`} className="list-group-item list-group-item-action p-3">
      <div className="d-flex w-100 justify-content-between align-items-center">
        
        {/* el checkbox para cambiar el estado */}
        <div className="me-3">
          <input
            className="form-check-input p-2"
            type="checkbox"
            checked={task.status === 'completa'}
            onChange={handletoggle}
            title={task.status === 'completa' ? 'marcar como incompleta' : 'marcar como completa'}
          />
        </div>
        
        {/* el título (que se tacha) y la descripción */}
        <div className="flex-grow-1 me-3">
          <h5 className={`mb-1 ${task.status === 'completa' ? 'text-decoration-line-through text-muted' : ''}`}>{task.title}</h5>
          <p className="mb-1 text-muted">{shortdescription}</p>
        </div>
        
        {/* el botón de borrar */}
        <div className="d-flex align-items-center">
          <button onClick={handledelete} className="btn btn-sm btn-outline-danger border-0" title="borrar tarea">
            <i className="bi bi-trash-fill fs-5"></i>
          </button>
        </div>

      </div>
    </Link>
  );
}

export default Task;
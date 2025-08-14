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

  const getstatusbadge = () => {
    let color = 'secondary';
    if (task.status === 'en proceso') color = 'primary';
    if (task.status === 'completa') color = 'success';
    return `text-bg-${color}`;
  };
  
  const handletoggle = (e) => {
    e.stopPropagation();
    e.preventDefault();
    ontogglestatus(task.id);
  };

  return (
    <Link to={`/task/${task.id}`} className="list-group-item list-group-item-action p-3">
      <div className="d-flex w-100 justify-content-between align-items-center">
        <div className="flex-grow-1 me-3">
          <h5 className={`mb-1 ${task.status === 'completa' ? 'text-decoration-line-through text-muted' : ''}`}>{task.title}</h5>
          <p className="mb-1 text-muted">{shortdescription}</p>
        </div>
        
        <div className="d-flex align-items-center gap-3">
          <span 
            className={`badge fs-6 ${getstatusbadge()} py-2 px-3`}
            style={{cursor: 'pointer'}}
            onClick={handletoggle}
            title="cambiar estado"
          >
            {task.status}
          </span>
          <button 
            onClick={handledelete} 
            className="btn btn-sm btn-outline-danger border-0" 
            title={task.status !== 'completa' ? 'solo se puede borrar una tarea completada' : 'borrar tarea'}
            disabled={task.status !== 'completa'}
          >
            <i className="bi bi-trash-fill fs-5"></i>
          </button>
        </div>
      </div>
    </Link>
  );
}

export default Task;
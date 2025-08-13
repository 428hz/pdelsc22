import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

function DetailPage({ tasks, ondeletetask, ontogglestatus }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const task = tasks.find(t => t.id === parseInt(id));

  const handledelete = () => {
    MySwal.fire({
      title: '¿estás seguro?',
      text: "no vas a poder revertir esto.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'sí, ¡borralo!',
      cancelButtonText: 'mejor no'
    }).then((result) => {
      if (result.isConfirmed) {
        ondeletetask(task.id);
        navigate('/');
        MySwal.fire(
          '¡borrada!',
          'la tarea fue eliminada.',
          'success'
        );
      }
    });
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
      <div className="card-header bg-transparent border-bottom-0 pt-3 d-flex justify-content-between align-items-center">
        <h3>detalle de la tarea</h3>
        <button 
          className={`btn ${task.status === 'completa' ? 'btn-success' : 'btn-warning'}`}
          onClick={() => ontogglestatus(task.id)}
        >
          <i className={`bi ${task.status === 'completa' ? 'bi-check-circle-fill' : 'bi-hourglass-split'} me-2`}></i>
          {task.status === 'completa' ? 'marcada como completa' : 'marcada como incompleta'}
        </button>
      </div>
      <div className="card-body">
        <h4 className={`card-title ${task.status === 'completa' ? 'text-decoration-line-through text-muted' : ''}`}>{task.title}</h4>
        <p className="card-text fs-5">{task.description}</p>
        <hr/>
        <div className="text-end">
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
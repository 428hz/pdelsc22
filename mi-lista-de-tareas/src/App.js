import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/homepage';
import DetailPage from './components/detailpage';
import CreatePage from './components/createpage';
import EditPage from './components/editpage'; // <-- no te olvides de este import
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

function App() {
  const [tasks, setTasks] = useState(() => {
    const savedtasks = localStorage.getItem('tasks');
    return savedtasks ? JSON.parse(savedtasks) : [
      { id: 1, title: 'hacer las compras', description: 'comprar pan, leche y huevos.', createdate: '2025-08-13', status: 'incompleta' },
      { id: 2, title: 'terminar el tp de react', description: 'hacer la lista de tareas con react router.', createdate: '2025-08-12', status: 'completa' },
      { id: 3, title: 'leer sobre react hooks', description: 'investigar sobre useeffect y usestate.', createdate: '2025-08-11', status: 'en proceso' }
    ];
  });

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addtask = (task) => {
    const newtask = {
      id: tasks.length > 0 ? Math.max(...tasks.map(t => t.id)) + 1 : 1,
      ...task,
      createdate: new Date().toISOString().split('t')[0],
    };
    setTasks([...tasks, newtask]);
  };

  const deletetask = (id) => {
    const updatedtasks = tasks.filter(task => task.id !== id);
    setTasks(updatedtasks);
  };

  const downloadtasks = () => {
    if (tasks.length === 0) {
      MySwal.fire({
        title: 'un momento...',
        text: 'primero tenés que crear al menos una tarea para descargar la lista.',
        icon: 'info',
        confirmButtonColor: '#0d6efd'
      });
      return;
    }
    const data = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(tasks, null, 2))}`;
    const link = document.createElement('a');
    link.href = data;
    link.download = 'tareas.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const toggletaskstatus = (id) => {
    setTasks(tasks.map(task => {
      if (task.id === id) {
        let newstatus = 'en proceso';
        if (task.status === 'incompleta') {
          newstatus = 'en proceso';
        } else if (task.status === 'en proceso') {
          newstatus = 'completa';
        } else {
          newstatus = 'incompleta';
        }
        return { ...task, status: newstatus };
      }
      return task;
    }));
  };

  const updatetask = (id, updatedtask) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, ...updatedtask, id: task.id } : task
    ));
  };

  return (
    <Router>
      <div className="bg-light min-vh-100 py-5">
        <div className="container">
          <div className="card shadow-sm">
            <div className="card-body">
              <h1 className="mb-4 text-center display-4">lista de tareas</h1>
              <Routes>
                <Route path="/" element={<HomePage tasks={tasks} ondownload={downloadtasks} ondeletetask={deletetask} ontogglestatus={toggletaskstatus} />} />
                <Route path="/task/:id" element={<DetailPage tasks={tasks} ondeletetask={deletetask} ontogglestatus={toggletaskstatus} />} />
                <Route path="/create" element={<CreatePage onaddtask={addtask} />} />
                <Route path="/task/:id/edit" element={<EditPage tasks={tasks} onupdatetask={updatetask} />} />
              </Routes>
            </div>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
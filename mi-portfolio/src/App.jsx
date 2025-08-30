// src/App.jsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { supabase } from './supabaseClient';

// Importamos TODOS los componentes que vamos a usar
import Header from './components/Header';
import Inicio from './components/Inicio';
import Habilidades from './components/Habilidades';
import Proyectos from './components/Proyectos';
import Experiencia from './components/Experiencia';
import Footer from './components/Footer';
import Login from './components/Login';
import Admin from './components/Admin';
import ProtectedRoute from './components/ProtectedRoute';
import BotonEditar from './components/BotonEditar';

// Creamos un componente para la página principal
function PaginaPrincipal() {
  return (
    <>
      <Inicio />
      <Habilidades />
      <Proyectos />
      <Experiencia />
    </>
  );
}

function App() {
  const [session, setSession] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <BrowserRouter>
      <div>
        <Header session={session} />
        <BotonEditar session={session} />
        
        <Routes>
          <Route path="/" element={<PaginaPrincipal />} />
          <Route path="/login" element={<Login />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/admin" element={<Admin />} />
          </Route>
        </Routes>
        
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
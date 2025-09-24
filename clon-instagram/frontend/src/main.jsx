import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import { Toaster } from 'react-hot-toast';

import ProtectedLayout from './layouts/ProtectedLayout.jsx';
import HomePage from './pages/HomePage/HomePage.jsx';
import LoginPage from './pages/LoginPage/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage/RegisterPage.jsx';
import CreatePostPage from './pages/CreatePostPage/CreatePostPage.jsx';
import ProfilePage from './pages/ProfilePage/ProfilePage.jsx';
import EditProfilePage from './pages/EditProfilePage/EditProfilePage.jsx';
// --- 1. IMPORTAMOS LA PÁGINA DE NOTIFICACIONES ---
import NotificationsPage from './pages/NotificationsPage/NotificationsPage.jsx'; 

import './index.css';

const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
  },
  {
    element: <ProtectedLayout />,
    children: [
      // --- 2. EL ORDEN CORRECTO ---
      // Las rutas más específicas y fijas van PRIMERO
      { path: '/', element: <HomePage /> },
      { path: '/create', element: <CreatePostPage /> },
      { path: '/settings/edit-profile', element: <EditProfilePage /> },
      // --- AÑADIMOS LA RUTA PARA NOTIFICACIONES AQUÍ ---
      { path: '/notifications', element: <NotificationsPage /> }, 
      
      // La ruta dinámica y general va al FINAL
      { path: '/:username', element: <ProfilePage /> },
    ]
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <Toaster 
        position="top-center"
        toastOptions={{ style: { background: '#363636', color: '#fff' } }}
      />
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
);
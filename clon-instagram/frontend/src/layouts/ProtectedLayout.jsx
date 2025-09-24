import { Outlet } from 'react-router-dom';
import Header from '../components/Header/Header.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { Navigate } from 'react-router-dom';

function ProtectedLayout() {
  const { session } = useAuth();

  // Si no hay sesión, redirigimos al login
  if (!session) {
    return <Navigate to="/login" />;
  }

  // Si hay sesión, mostramos el Header y el contenido de la página actual
  return (
    <>
      <Header />
      <main>
        <Outlet /> {/* Aquí se renderizará HomePage, ProfilePage, etc. */}
      </main>
    </>
  );
}

export default ProtectedLayout;
import { useAuth } from './context/AuthContext.jsx'; // 1. Importamos nuestro hook
import { Navigate } from 'react-router-dom'; // 2. Importamos Navigate para redirigir
import HomePage from './pages/HomePage/HomePage.jsx';

function App() {
  const { session } = useAuth(); // 3. Obtenemos la sesión del contexto

  // 4. Lógica de protección:
  // Si NO hay sesión, redirigimos al usuario a la página de login.
  if (!session) {
    return <Navigate to="/login" />;
  }

  // Si SÍ hay sesión, mostramos la página de inicio.
  return (
    <HomePage />
  );
}

export default App;
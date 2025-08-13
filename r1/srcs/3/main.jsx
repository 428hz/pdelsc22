// traemos el strictmode de react, es como un inspector de calidad que nos avisa si hacemos algo raro
import { StrictMode } from 'react'
// esta es la herramienta para decirle a react dónde tiene que dibujar la aplicación en la página
import { createRoot } from 'react-dom/client'
// importamos los estilos generales que le pusimos al index.css
import './index.css'
// y traemos nuestro componente principal, el app.jsx, que es el que manda todo
import App from './App.jsx'

// acá empieza la magia:
// buscamos en el html el div que tiene el id 'root' y le decimos a react que se prepare para dibujar ahí
createRoot(document.getElementById('root')).render(
  // el strictmode envuelve nuestra app para darnos una mano, no se ve en la página pero nos ayuda a programar mejor
  <StrictMode>
    {/* y acá adentro le decimos que dibuje nuestro componente principal, el app */}
    <App />
  </StrictMode>,
)
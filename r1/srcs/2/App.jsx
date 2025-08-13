// traemos react que es la base de todo
import React from 'react';
// acá importamos el componente de la tarjeta que armamos en el otro archivo
import TarjetaPresentacion from './TarjetaPresentacion.jsx';

// app es el componente principal de este proyecto, el que muestra todo
function App() {
  // acá le decimos a react qué tiene que dibujar en la pantalla
  return (
    // un div para acomodar las tarjetas, con estilos puestos directamente acá para que se vean una al lado de la otra
    <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap', justifyContent: 'center' }}>
      {/* acá usamos nuestro componente de tarjeta por primera vez */}
      <TarjetaPresentacion 
        nombre="bruce wayne"
        profesion="filántropo multimillonario"
        // el link a la foto que sacamos de wikipedia
        imagenUrl="https://upload.wikimedia.org/wikipedia/en/1/19/Bruce_Wayne_%28The_Dark_Knight_Trilogy%29.jpg" 
      />
      {/* y acá lo usamos de nuevo, pero le pasamos otra data, para que veas cómo se reutiliza */}
      <TarjetaPresentacion 
        nombre="clark kent"
        profesion="periodista del daily planet"
        // el link a la otra foto, sin los agregados raros de la url
        imagenUrl="https://static.wikia.nocookie.net/smallville/images/7/7d/Clark_kent_profile.png"
      />
    </div>
  );
}

// con esto hacemos que el archivo main.jsx pueda usar este componente app
export default App;
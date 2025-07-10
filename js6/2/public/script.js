// public/script.js

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('userForm');
    const responseMessage = document.getElementById('responseMessage');

    form.addEventListener('submit', async (event) => {
        // 1. Prevenimos el comportamiento por defecto del formulario (recargar la página)
        event.preventDefault();

        // 2. Obtenemos los datos de los inputs
        const nombre = document.getElementById('nombre').value;
        const email = document.getElementById('email').value;
        const data = { nombre, email };

        try {
            // 3. Enviamos los datos al servidor usando Fetch API con método POST
            const response = await fetch('/api/formulario', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            // Verificamos si la respuesta del servidor fue exitosa
            if (!response.ok) {
                throw new Error(`Error del servidor: ${response.status}`);
            }

            // Convertimos la respuesta a JSON
            const result = await response.json();

            // 4. Mostramos los resultados en la consola del NAVEGADOR
            console.log('Respuesta recibida del servidor:');
            console.log(result);

            // 5. Mostramos el ID de respuesta en el HTML
            responseMessage.textContent = `✅ ¡Éxito! Tu ID de registro es: ${result.id}`;
            responseMessage.style.display = 'block'; // Hacemos visible el mensaje

            // Opcional: limpiar el formulario después de un envío exitoso
            form.reset();

        } catch (error) {
            // 6. Manejamos cualquier error de red o del servidor
            console.error('Error al enviar el formulario:', error);
            responseMessage.textContent = `❌ Error: ${error.message}`;
            responseMessage.style.backgroundColor = '#f8d7da';
            responseMessage.style.color = '#721c24';
            responseMessage.style.display = 'block';
        }
    });
});

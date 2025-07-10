// public/script.js

// con esto nos aseguramos de que todo el código se ejecute recién cuando el html ya se cargó completo
document.addEventListener('DOMContentLoaded', () => {
    // agarramos del html los dos elementos con los que vamos a laburar, el buscador y la lista
    const searchInput = document.getElementById('searchInput');
    const userList = document.getElementById('userList');
    
    // una variable para guardar todos los usuarios que traigamos de la api
    let allUsers = [];

    /**
     * esta función se encarga de mostrar la lista de usuarios en la pantalla
     * @param {Array} users - el array de usuarios a mostrar
     */
    const displayUsers = (users) => {
        // fundamental, primero vaciamos la lista para que no se repitan los nombres
        userList.innerHTML = '';

        // si el array de usuarios no tiene nada, ponemos un mensaje de que no se encontró nada
        if (users.length === 0) {
            const li = document.createElement('li');
            li.textContent = 'no se encontraron usuarios';
            userList.appendChild(li);
            return;
        }

        // ahora recorremos el array de usuarios uno por uno
        users.forEach(user => {
            // creamos un elemento 'li' por cada usuario, o sea un renglón de la lista
            const li = document.createElement('li');
            // esta nueva api nos da el nombre y apellido por separado, acá los juntamos
            li.textContent = `${user.firstName} ${user.lastName}`;
            // y mandamos el renglón a la lista del html
            userList.appendChild(li);
        });
    };

    /**
     * la función más importante, la que va a buscar los datos a internet
     */
    const fetchUsers = async () => {
        // le ponemos un try-catch por las dudas, si algo falla no se rompe todo
        try {
            // acá hacemos la llamada a la api para traer 100 usuarios
            const response = await fetch('https://dummyjson.com/users?limit=100');

            // chequeamos si la respuesta del servidor estuvo bien, si no, avisamos
            if (!response.ok) {
                throw new Error('la respuesta de la red no fue correcta');
            }
            
            // la data viene en un objeto, así que primero la agarramos y después sacamos la lista de adentro
            const data = await response.json();
            allUsers = data.users;
            
            // mostramos un mensaje en la consola para ver que anduvo bien y cuántos trajo
            console.log(`✅ ${allUsers.length} usuarios obtenidos de la api:`, allUsers);
            
            // una vez que tenemos los datos, llamamos a la función para que los muestre
            displayUsers(allUsers);

        } catch (error) {
            // si la llamada a la api falló, lo mostramos como un error en la consola
            console.error('❌ error al obtener los usuarios:', error);
            userList.innerHTML = '<li>error al cargar los datos</li>';
        }
    };

    // este aparato se queda escuchando cada vez que alguien escribe algo en el buscador
    searchInput.addEventListener('input', (event) => {
        // agarramos lo que se escribió, lo ponemos en minúscula y le sacamos espacios extra
        const searchTerm = event.target.value.toLowerCase().trim();

        // acá filtramos la lista original de 100 usuarios
        const filteredUsers = allUsers.filter(user => {
            // para filtrar, juntamos nombre y apellido y nos fijamos si incluye el texto de búsqueda
            const fullName = `${user.firstName} ${user.lastName}`;
            return fullName.toLowerCase().includes(searchTerm);
        });
        
        // otro mensajito en la consola para ver qué está filtrando en tiempo real
        console.log(`🔎 filtrando por "${searchTerm}":`, filteredUsers);

        // y volvemos a """dibujar""" la lista, pero esta vez solo con los resultados filtrados
        displayUsers(filteredUsers);
    });

    // ni bien carga la página, llamamos a esta función para que se llene la lista de una
    fetchUsers();
});
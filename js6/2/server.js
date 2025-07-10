
// para traer la librería express, el aparato que maneja el servidor
const express = require('express')
const path = require('path')
// acá creamos la aplicación, el coso principal de express
const app = express()
// definimos el puerto donde va a correr todo, el 3000 es un clásico
const port = 3000

// un middleware para que el servidor entienda json
app.use(express.json())
// con esto le decimos que la carpeta 'public' tiene los archivos estáticos como el html y el css
app.use(express.static(path.join(__dirname, 'public')))

// acá armamos la ruta que espera los datos del formulario por post
app.post('/api/formulario', (req, res) => {
    // sacamos el nombre y el email que vienen en el cuerpo del pedido
    const { nombre, email } = req.body

    // mostramos en la consola del servidor lo que nos llegó
    console.log('datos recibidos en el servidor:')
    console.log({ nombre, email })

    // por si mandan el formulario vacío, viste
    if (!nombre || !email) {
        return res.status(400).json({ error: 'nombre y email son requeridos' })
    }

    // generamos un id único medio a lo bestia con la fecha, para devolver algo
    const nuevoid = `user-${Date.now()}`

    // mandamos la respuesta para el navegador, con el id y un mensajito de que salió todo joya
    res.status(201).json({ 
        message: 'usuario registrado con éxito',
        id: nuevoid,
        data: { nombre, email }
    })
})

// acá prendemos el motor, ponemos a """escuchar""" el servidor en el puerto que dijimos
app.listen(port, () => {
    console.log(`🚀 servidor corriendo en http://localhost:${port}`)
})

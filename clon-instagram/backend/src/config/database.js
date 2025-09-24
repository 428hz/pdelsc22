import mysql from 'mysql2/promise';
import 'dotenv/config';

// Creamos el "pool" de conexiones a la base de datos
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    port: process.env.DB_PORT,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Hacemos una prueba de conexión para asegurarnos de que todo funciona
try {
    const connection = await pool.getConnection();
    console.log('¡Conexión a la base de datos establecida con éxito!');
    connection.release();
} catch (error) {
    console.error('Error al conectar a la base de datos:', error.message);
}

// Exportamos la conexión para que otros archivos puedan usarla
export default pool;
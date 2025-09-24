import pool from '../config/database.js';
import bcrypt from 'bcryptjs';

export const register = async (req, res) => {
  try {
    const { email, username, password } = req.body;

    if (!email || !username || !password) {
      return res.status(400).json({ message: 'todos los campos son requeridos.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const [result] = await pool.query(
      'INSERT INTO users (email, username, password) VALUES (?, ?, ?)',
      [email, username, hashedPassword]
    );

    console.log(`Usuario creado con ID: ${result.insertId}`);
    return res.status(201).json({ 
      id: result.insertId,
      username,
      email,
      message: 'usuario registrado con éxito.' 
    });

  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ message: 'el nombre de usuario o el correo ya están en uso.' });
    }
    
    console.error('Error en el registro:', error.message);
    return res.status(500).json({ message: 'error interno del servidor.' });
  }
};
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/api/user/register`, form, { withCredentials: true });
      setMessage('Регистрация прошла успешно! 🎉');
      setTimeout(() => navigate('/login'), 1500);
    } catch (error) {
      console.error("Ошибка при регистрации:", error);
      setMessage(error.response?.data || 'Произошла ошибка при регистрации.');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2>Регистрация</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          <input type="text" name="username" placeholder="Имя пользователя" value={form.username} onChange={handleChange} required style={styles.input} />
          <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} required style={styles.input} />
          <input type="password" name="password" placeholder="Пароль" value={form.password} onChange={handleChange} required style={styles.input} />
          <button type="submit" style={styles.button}>Зарегистрироваться</button>
        </form>
        <p style={styles.switch}>
          Уже есть аккаунт? <span onClick={() => navigate('/login')} style={styles.link}>Войти</span>
        </p>
        {message && <p style={styles.message}>{message}</p>}
      </div>
    </div>
  );
};

const styles = {
  container: {
    background: '#f0f8ff',
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontFamily: '"Segoe UI", sans-serif',
  },
  card: {
    background: '#ffffff',
    padding: '2rem',
    borderRadius: '10px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    width: '320px',
    textAlign: 'center',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    marginTop: '1rem',
  },
  input: {
    padding: '0.7rem',
    borderRadius: '6px',
    border: '1px solid #ccc',
    fontSize: '1rem',
  },
  button: {
    background: '#6a5acd',
    color: '#fff',
    border: 'none',
    padding: '0.8rem',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: 'bold',
    transition: 'background 0.3s',
  },
  switch: {
    marginTop: '1rem',
    fontSize: '0.9rem',
  },
  link: {
    color: '#6a5acd',
    cursor: 'pointer',
    textDecoration: 'underline',
  },
  message: {
    marginTop: '1rem',
    color: 'green',
    fontSize: '0.9rem',
  },
};

export default RegisterPage;

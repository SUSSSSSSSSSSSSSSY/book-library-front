import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const ProfilePage = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [createdBooks, setCreatedBooks] = useState([]);
  const [recentBooks, setRecentBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }


    try {
    const decoded = jwtDecode(token);
    const role =
      decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] ||
      decoded.role;

    setUserRole(role);
    } catch (err) {
      console.error("Ошибка декодирования токена", err);
    }


    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/User/profile/my-profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const { username, email, createdBooks, lastViewed, role } = res.data;

      setUserInfo({ username, email, role });
      setCreatedBooks(createdBooks || []);
      setRecentBooks(lastViewed ? Array.from(new Map(lastViewed.map(book => [book.id, book])).values()) : []);
    } catch (err) {
      console.error('Ошибка при загрузке профиля:', err);
      navigate('/login');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const handleManageBooks = () => {
    navigate('/my-books-manager')
  }

  const handleBookClick = (bookId) => {
    navigate(`/book/${bookId}`);
  };

  const handleAdminClick = () => {
    navigate('/admin');
  };

  const handleReturnMain = () => {
    navigate('/');
  }

  if (loading) return <p>Загрузка...</p>;

  return (
    <div style={styles.container}>
      <div style={styles.profileCard}>
        <h2 style={styles.heading}>👤 Профиль</h2>
        {userInfo ? (
          <>
            <p><strong>Имя пользователя:</strong> {userInfo.username}</p>
            <p><strong>Email:</strong> {userInfo.email}</p>

            <button style={styles.logoutBtn} onClick={handleLogout}>Выйти</button>

            <button style={styles.adminBtn} onClick={handleManageBooks}>Управление книгами</button>

            {userRole === 'Admin' && (
              <button style={styles.adminBtn} onClick={handleAdminClick}>Панель администратора</button>
            )}

            <button style={styles.adminBtn} onClick={handleReturnMain}>На главную</button>
          </>
        ) : (
          <p>Пользователь не найден</p>
        )}
      </div>

      <div style={styles.section}>
        <h3>📚 Созданные книги</h3>
        {createdBooks.length === 0 ? (
          <p>Нет созданных книг</p>
        ) : (
          <div style={styles.cardGrid}>
            {createdBooks.map(book => (
              <div key={book.id} style={styles.bookCard} onClick={() => handleBookClick(book.id)}>
                <h4>{book.title}</h4>
                <p>Рейтинг: {book.rate?.toFixed(2) ?? 0}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={styles.section}>
        <h3>🕓 Недавние просмотры</h3>
        {recentBooks.length === 0 ? (
          <p>История пуста</p>
        ) : (
          <div style={styles.cardGrid}>
            {recentBooks.map(book => (
              <div key={book.id} style={styles.bookCard} onClick={() => handleBookClick(book.id)}>
                <h4>{book.title}</h4>
                <p>Автор: {book.authorUsername}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '2rem',
    fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
    backgroundColor: '#f4f4f4',
    minHeight: '100vh',
  },
  profileCard: {
    backgroundColor: '#ffffff',
    padding: '1.5rem',
    borderRadius: '10px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    marginBottom: '2rem',
  },
  heading: {
    fontSize: '1.5rem',
    marginBottom: '1rem',
  },
  logoutBtn: {
    marginTop: '1rem',
    padding: '0.5rem 1rem',
    backgroundColor: '#ff4d4d',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    marginRight: '1rem',
  },
  adminBtn: {
    marginTop: '1rem',
    padding: '0.5rem 1rem',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
  },
  section: {
    marginBottom: '2rem',
  },
  cardGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
    gap: '1rem',
    marginTop: '1rem',
  },
  bookCard: {
    backgroundColor: '#fff',
    padding: '1rem',
    borderRadius: '10px',
    boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
    cursor: 'pointer',
    transition: 'transform 0.2s ease',
  },
};

export default ProfilePage;

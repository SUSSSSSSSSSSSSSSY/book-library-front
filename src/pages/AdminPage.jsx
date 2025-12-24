import React, { useEffect, useState } from 'react';
import axios from '../utils/axiosConfig';

const AdminPage = () => {
  const [users, setUsers] = useState([]);
  const [books, setBooks] = useState([]);
  const [categoryName, setCategoryName] = useState('');

  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    fetchUsers();
    fetchBooks();
  }, []);

  const fetchUsers = async () => {
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/user/all`, { headers });
    setUsers(res.data);
  };

  const fetchBooks = async () => {
  try {
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/book/all`, { headers });
    console.log("Ответ от /api/book/all:", res.data);
    const data = res.data;
    setBooks(Array.isArray(data) ? data : data.books || []);
  } catch (err) {
    console.error("Ошибка при загрузке книг:", err);
    setBooks([]);
  }
};


  const deleteUser = async (id) => {
    await axios.delete(`${process.env.REACT_APP_API_URL}/api/admin/delete-user/${id}`, { headers });
    fetchUsers();
  };

  const deleteBook = async (id) => {
    await axios.delete(`${process.env.REACT_APP_API_URL}/api/admin/delete-book/${id}`, { headers });
    fetchBooks();
  };

  const addCategory = async () => {
    if (!categoryName.trim()) return;
    await axios.post(`${process.env.REACT_APP_API_URL}/api/admin/add-category`, { name: categoryName }, { headers });
    alert("Категория добавлена");
    setCategoryName('');
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Админ-панель</h2>

      <section>
        <h3>Пользователи</h3>
        <ul>
          {users.map(user => (
            <li key={user.id}>
              {user.username} — {user.email}
              <button onClick={() => deleteUser(user.id)}>Удалить</button>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h3>Книги</h3>
        <ul>
          {books.map(book => (
            <li key={book.id}>
              {book.title}
              <button onClick={() => deleteBook(book.id)}>Удалить</button>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h3>Добавить категорию</h3>
        <input
          type="text"
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
          placeholder="Название категории"
        />
        <button onClick={addCategory}>Добавить</button>
      </section>
    </div>
  );
};

export default AdminPage;

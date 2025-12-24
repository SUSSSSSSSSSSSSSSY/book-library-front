import React, { useEffect, useState } from 'react';
import axios from '../utils/axiosConfig';
import { useNavigate } from 'react-router-dom';
import './MainPage.css';

const MainPage = () => {
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filter, setFilter] = useState('');
  const [userIdFilter, setUserIdFilter] = useState('');
  const [titleFilter, setTitleFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [sortByAuthor, setSortByAuthor] = useState('');
  const [page, setPage] = useState(1);
  const [totalBooks, setTotalBooks] = useState(0);
  const [pageSize] = useState(5);

  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchBooks();
    fetchCategories();
  }, [categoryFilter, titleFilter, userIdFilter, sortByAuthor, page]);

  const fetchBooks = async () => {
    try {
      const response = await axios.get('/api/Book/all', {
        params: {
          title: titleFilter || undefined,
          userId: userIdFilter || undefined,
          categoryId: categoryFilter || undefined,
          sortByAuthor: sortByAuthor || undefined,
          page,
          pageSize,
        },
      });

      setBooks(response.data.books || []);
      setTotalBooks(response.data.totalBooks || 0);
    } catch (error) {
      console.error('Ошибка при загрузке книг:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get('/api/Category/');
      setCategories(res.data);
    } catch (err) {
      console.error('Ошибка при загрузке категорий:', err);
    }
  };

  const handleProfileClick = () => {
    if (!token) navigate('/login');
    else navigate('/profile');
  };

  const handleCreateBook = () => navigate('/create-book');
  const handleRegister = () => navigate('/register');
  const handleLogin = () => navigate('/login');
  const handleBookClick = (id) => navigate(`/book/${id}`);

  const totalPages = Math.ceil(totalBooks / pageSize);

  return (
    <div className="main-container">
      <h2 className="header">📚 Добро пожаловать в онлайн-библиотеку</h2>

      <div className="input-group">
        <input
          type="text"
          placeholder="Поиск по названию..."
          value={titleFilter}
          onChange={(e) => {
            setTitleFilter(e.target.value);
            setPage(1);
          }}
        />

        <input
          type="text"
          placeholder="Поиск по ID пользователя..."
          value={userIdFilter}
          onChange={(e) => {
            setUserIdFilter(e.target.value);
            setPage(1);
          }}
        />

        <select
          value={categoryFilter}
          onChange={(e) => {
            setCategoryFilter(e.target.value);
            setPage(1);
          }}
        >
          <option value="">Все категории</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>

        <select
          value={sortByAuthor}
          onChange={(e) => {
            setSortByAuthor(e.target.value);
            setPage(1);
          }}
        >
          <option value="">Без сортировки</option>
          <option value="asc">Автор ↑</option>
          <option value="desc">Автор ↓</option>
        </select>
      </div>

      <div className="button-group">
        {token && <button onClick={handleProfileClick}>Профиль</button>}
        <button onClick={handleCreateBook}>Создать книгу</button>
        {!token && (
          <>
            <button onClick={handleRegister}>Регистрация</button>
            <button onClick={handleLogin}>Войти</button>
          </>
        )}
      </div>

      <div className="books-section">
        {books.length === 0 ? (
          <p>Книги не найдены.</p>
        ) : (
          books.map((book) => (
            <div
              key={book.id}
              className="book-card"
              onClick={() => handleBookClick(book.id)}
            >
              <h3>{book.title}</h3>
              <p>Автор: {book.authorName || 'Неизвестен'}</p>
            </div>
          ))
        )}
      </div>

      {/* 🔹 Пагинация */}
      {totalPages > 1 && (
        <div className="pagination">
          <button
            disabled={page === 1}
            onClick={() => setPage((prev) => prev - 1)}
          >
            ⬅ Предыдущая
          </button>

          <span>
            Страница {page} из {totalPages}
          </span>

          <button
            disabled={page === totalPages}
            onClick={() => setPage((prev) => prev + 1)}
          >
            Следующая ➡
          </button>
        </div>
      )}
    </div>
  );
};

export default MainPage;

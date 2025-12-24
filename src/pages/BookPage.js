import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const BookPage = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [pages, setPages] = useState([]);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [message, setMessage] = useState('');
  const token = localStorage.getItem('token');
  const CHARS_PER_PAGE = 1000;

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/book/${id}`);
        const content = res.data.content || '';
        const pageCount = Math.ceil(content.length / CHARS_PER_PAGE);
        const splitPages = Array.from({ length: pageCount }, (_, i) =>
          content.slice(i * CHARS_PER_PAGE, (i + 1) * CHARS_PER_PAGE)
        );
        setBook(res.data);
        setPages(splitPages);
      } catch (err) {
        console.error('Ошибка при загрузке книги:', err);
      }
    };

    const recordView = async () => {
      if (!token) return;
      try {
        await axios.post(
          `${process.env.REACT_APP_API_URL}/api/browsingHistory/recordview`,
          { bookId: id },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } catch (err) {
        console.error('Ошибка при записи истории просмотра:', err);
      }
    };

    fetchBook();
    recordView();
  }, [id]);

  const handleRate = async (score) => {
    if (!token) {
      setMessage('Только авторизованные пользователи могут оценивать.');
      return;
    }
    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/api/rating`,
        { bookId: id, score },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setRating(score);
      setMessage('Оценка успешно сохранена.');
    } catch (error) {
      console.error('Ошибка при оценке:', error);
      setMessage('Произошла ошибка при сохранении оценки.');
    }
  };

  if (!book) return <p>Загрузка...</p>;

  return (
    <div style={styles.container}>
      <div style={styles.book}>
        <div style={styles.page}>
          <h1 style={styles.title}>{book.title}</h1>
          <p style={styles.meta}>Автор: {book.authorUsername}</p>
          <p style={styles.meta}>Рейтинг: {book.averageRating.toFixed(1)}</p>
          <hr />
          <p style={styles.text}>
            {pages[currentPage]}
          </p>
        </div>
        <div style={styles.controls}>
          <button onClick={() => setCurrentPage((p) => Math.max(p - 1, 0))} disabled={currentPage === 0}>
            ◀ Назад
          </button>
          <span>Страница {currentPage + 1} из {pages.length}</span>
          <button onClick={() => setCurrentPage((p) => Math.min(p + 1, pages.length - 1))} disabled={currentPage === pages.length - 1}>
            Вперёд ▶
          </button>
        </div>

        {token && (
          <div style={styles.rating}>
            <h3>Оценить книгу:</h3>
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                style={{
                  fontSize: '2rem',
                  cursor: 'pointer',
                  color: (hover || rating) >= star ? 'gold' : '#ccc',
                  transition: 'color 0.2s',
                }}
                onClick={() => handleRate(star)}
                onMouseEnter={() => setHover(star)}
                onMouseLeave={() => setHover(0)}
              >
                ★
              </span>
            ))}
            {message && <p style={styles.message}>{message}</p>}
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '2rem',
    background: '#f5f5dc',
    minHeight: '100vh',
    fontFamily: '"Georgia", serif',
    display: 'flex',
    justifyContent: 'center',
  },
  book: {
    width: '70%',
    background: '#fff8dc',
    border: '2px solid #deb887',
    boxShadow: '5px 5px 15px rgba(0,0,0,0.2)',
    padding: '2rem',
    borderRadius: '12px',
  },
  page: {
    minHeight: '400px',
    padding: '1rem',
  },
  title: {
    fontSize: '2rem',
    marginBottom: '0.5rem',
  },
  meta: {
    fontSize: '0.9rem',
    color: '#555',
  },
  text: {
    marginTop: '1rem',
    lineHeight: '1.6',
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
  },
  controls: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '2rem',
  },
  rating: {
    marginTop: '2rem',
  },
  message: {
    marginTop: '0.5rem',
    color: 'green',
  }
};

export default BookPage;

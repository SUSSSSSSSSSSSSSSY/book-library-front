import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MyBooksManager = () => {
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [formData, setFormData] = useState({ title: '', content: '', categoryId: '' });

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchMyBooks();
    fetchCategories();
  }, []);

  const fetchMyBooks = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/book/my-books`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBooks(res.data);
    } catch (err) {
      alert('Ошибка загрузки книг');
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/Category`);
      setCategories(res.data);
    } catch (err) {
      alert('Ошибка загрузки категорий');
    }
  };

  const handleEdit = (book) => {
    setSelectedBook(book);
    setFormData({
      title: book.title,
      content: book.content || '',
      categoryId: book.categoryId,
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Вы уверены, что хотите удалить книгу?')) return;

    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/book/delete-my-book/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Книга удалена');
      fetchMyBooks();
    } catch (err) {
      alert('Ошибка удаления');
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!selectedBook) return;

    try {
      await axios.put(`${process.env.REACT_APP_API_URL}/api/book/update-my-book/${selectedBook.id}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Книга обновлена');
      setSelectedBook(null);
      setFormData({ title: '', content: '', categoryId: '' });
      fetchMyBooks();
    } catch (err) {
      alert('Ошибка обновления');
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>📚 Мои книги</h2>

      <div style={styles.grid}>
        {books.map((book) => (
          <div key={book.id} style={styles.card}>
            <h3>{book.title}</h3>
            <p><strong>Категория ID:</strong> {book.categoryId}</p>
            <div style={styles.buttonRow}>
              <button style={styles.editBtn} onClick={() => handleEdit(book)}>Редактировать</button>
              <button style={styles.deleteBtn} onClick={() => handleDelete(book.id)}>Удалить</button>
            </div>
          </div>
        ))}
      </div>

      {selectedBook && (
        <div style={styles.formContainer}>
          <h3>✏️ Редактировать книгу</h3>
          <form onSubmit={handleUpdate}>
            <div style={styles.formGroup}>
              <label>Название:</label>
              <input
                style={styles.input}
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>

            <div style={styles.formGroup}>
              <label>Содержание:</label>
              <textarea
                style={styles.textarea}
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                rows="5"
              />
            </div>

            <div style={styles.formGroup}>
              <label>Категория:</label>
              <select
                style={styles.input}
                value={formData.categoryId}
                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
              >
                <option value="">Выберите категорию</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div style={styles.buttonRow}>
              <button type="submit" style={styles.saveBtn}>💾 Сохранить</button>
              <button type="button" style={styles.cancelBtn} onClick={() => setSelectedBook(null)}>Отмена</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: '30px',
    maxWidth: '900px',
    margin: 'auto',
    fontFamily: 'Segoe UI, sans-serif'
  },
  heading: {
    textAlign: 'center',
    marginBottom: '30px',
    color: '#2c3e50',
  },
  grid: {
    display: 'grid',
    gap: '20px',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
  },
  card: {
    backgroundColor: '#f9f9f9',
    border: '1px solid #ddd',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
  },
  buttonRow: {
    marginTop: '15px',
    display: 'flex',
    gap: '10px',
  },
  editBtn: {
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    padding: '8px 14px',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  deleteBtn: {
    backgroundColor: '#e74c3c',
    color: 'white',
    border: 'none',
    padding: '8px 14px',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  formContainer: {
    marginTop: '40px',
    backgroundColor: '#f1f1f1',
    padding: '25px',
    borderRadius: '10px',
  },
  formGroup: {
    marginBottom: '15px',
  },
  input: {
    width: '100%',
    padding: '8px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    fontSize: '16px',
  },
  textarea: {
    width: '100%',
    padding: '10px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    fontSize: '16px',
    resize: 'vertical',
  },
  saveBtn: {
    backgroundColor: '#2ecc71',
    color: 'white',
    border: 'none',
    padding: '10px 18px',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  cancelBtn: {
    backgroundColor: '#7f8c8d',
    color: 'white',
    border: 'none',
    padding: '10px 18px',
    borderRadius: '5px',
    cursor: 'pointer',
  },
};

export default MyBooksManager;

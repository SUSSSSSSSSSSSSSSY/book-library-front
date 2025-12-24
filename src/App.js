import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import MainPage from './pages/MainPage';
import CreateBookPage from './pages/CreateBookPage';
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';
import BookPage from './pages/BookPage';
import ProfilePage from './pages/ProfilePage';
import AdminPage from './pages/AdminPage';
import MyBooksManager from './pages/MyBooksManager';



function App() {
  return (
    <Router>
      <Routes>
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<MainPage />} />
        {/* Защищённая страница */}
        <Route
          path="/create-book"
          element={
            <PrivateRoute>
              <CreateBookPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <ProfilePage />
            </PrivateRoute>
          }
        />
        <Route
          path="/my-books-manager"
          element={
            <PrivateRoute>
              <MyBooksManager />
            </PrivateRoute>
          }
        />
        <Route path="/book/:id" element={<BookPage />} />

        <Route
  path="/admin"
  element={
    <AdminRoute>
      <AdminPage />
    </AdminRoute>
  }
/>

      </Routes>
    </Router>
  );
}

export default App;

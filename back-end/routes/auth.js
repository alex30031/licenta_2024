import express from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';

app.post('/login', authMiddleware, (req, res) => {
    // Dacă middleware-ul de autentificare a trecut, utilizatorul este autentificat
    res.json({ message: 'Autentificare reușită!', user: req.user });
  });
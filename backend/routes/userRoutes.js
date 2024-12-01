const express = require('express');
const { addUser, getUsers } = require('../controllers/userController');

const router = express.Router();

// Kullanıcı ekleme
router.post('/add-user', addUser);

// Kullanıcıları listeleme
router.get('/users', getUsers);

module.exports = router;

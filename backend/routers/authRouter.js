const express = require('express');
const authRouter = express.Router();
const {
    handleLogin,
    tryToLogin,
    tryToRegister
} = require('../controllers/authController');

authRouter
    .route('/login')
    .get(handleLogin)
    .post(tryToLogin);

authRouter
    .route('/register')
    .post(tryToRegister);

module.exports = authRouter;
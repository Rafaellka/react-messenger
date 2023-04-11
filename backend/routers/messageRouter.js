const express = require('express');
const messageRouter = express.Router();
const {handleMessages, getNewMessage} = require('../controllers/messageController');

messageRouter
    .route('/:id')
    .get(handleMessages)
    .post(getNewMessage);

module.exports = messageRouter;

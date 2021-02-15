var express = require('express');
var router = express.Router();

var user_controller = require('../controllers/userController');
var message_controller = require('../controllers/messageController');

// Home page -> login/signup button + all messages
router.get('/', message_controller.index);

// All Messages -> display after login with creator + create new msg + delete msg if admin
router.get('/messages', message_controller.message_list);

// GET create new message
router.get('/create', message_controller.message_create_get);

// POST create new message
router.post('/create', message_controller.message_create_post);

// GET delete message get
router.get('/:id/delete', message_controller.message_delete_get);

// POST delete message post
router.post('/:id/delete', message_controller.message_delete_post);

module.exports = router;
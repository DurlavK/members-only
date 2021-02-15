var express = require('express');
var router = express.Router();

var user_controller = require('../controllers/userController');
var message_controller = require('../controllers/messageController');

// Sign up page
router.get('/create', user_controller.user_create_get);
router.post('/create', user_controller.user_create_post);

// Login page
router.get('/login', user_controller.user_login_get);
router.post('/login',user_controller.user_login_post);

// Member and admin page
router.get('/:id/update', user_controller.user_update_get);
router.post('/:id/update', user_controller.user_update_post);

router.get('/logout', user_controller.user_logout);

module.exports = router;
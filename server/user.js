const express = require('express');
const router = express.Router();
const UserController = require('./user_controller');

router.get('/signin', UserController.sign_in);

router.get('/:id', UserController.get_user);

module.exports = router;

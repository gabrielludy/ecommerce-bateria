const express = require('express');
const router = express.Router();

//import middlewares
const checkAuth = require('../middlewares/check-auth');
const checkAuthAdmin = require('../middlewares/check-auth-admin');

//import controllers
const UsersController = require('../controllers/users');

router.post('/signup', UsersController.users_signup);

router.post('/login', UsersController.users_login);

router.delete("/:userId", checkAuthAdmin, UsersController.users_delete_user);

module.exports = router;
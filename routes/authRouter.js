const { body } = require('express-validator');

const userController = require('../controllers/user');

const authRoutes = [
  {
    method: 'post',
    path: '/sign-up',
    validators: [
      body('name').notEmpty(),
      body('email').isEmail(),
      body('password').isLength({ min: 6, max: 20 }),
    ],
    middleware: [userController.signUp],
  }, {
    method: 'post',
    path: '/sign-in',
    validators: [
      body('email').isEmail(),
      body('password').notEmpty(),
    ],
    middleware: [userController.signIn],
  },
];

module.exports = { routes: authRoutes, path: '/auth' };

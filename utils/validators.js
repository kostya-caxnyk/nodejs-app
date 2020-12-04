const { body } = require('express-validator');
const User = require('../models/user');

exports.regusterValidators = [
  body('email')
    .isEmail()
    .withMessage('Enter valid email')
    .custom(async (value, { req }) => {
      try {
        const candidate = await User.findOne({ email: value });

        if (candidate) {
          return Promise.reject('User with this email already exist');
        }
      } catch (e) {
        console.log(e);
      }
    })
    .normalizeEmail(),
  body('password', 'Password must be minimum 6 characters')
    .isLength({ min: 6, max: 56 })
    .isAlphanumeric()
    .trim(),
  body('repeat')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Passwords are not equal');
      } else return true;
    })
    .trim(),
  body('name')
    .isLength({ min: 3 })
    .withMessage('Your name is really less than 3 characters?')
    .trim(),
];

exports.loginValidators = [
  body('email')
    .isEmail()
    .withMessage('Invalid email')
    .custom(async (value, { req }) => {
      const candidate = await User.findOne({ email: value });
      if (!candidate) {
        return Promise.reject('No such user with this email');
      }
    })
    .normalizeEmail(),
  body('password', 'Password must be minimum 6 characters')
    .isLength({ min: 6, max: 56 })
    .isAlphanumeric()
    .trim(),
];

exports.coursesValidators = [
  body('title').isLength({ min: 3 }).withMessage('Title must be at least 3 characters').trim(),
  body('price').isNumeric().withMessage('Enter a valid price'),
  body('img', 'Enter a valid image Url').isURL(),
];

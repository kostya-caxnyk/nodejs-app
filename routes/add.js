const { Router } = require('express');
const { validationResult } = require('express-validator');
const Course = require('../models/course');
const auth = require('../middleware/auth');
const { coursesValidators } = require('../utils/validators.js');

const router = Router();

router.get('/', auth, (req, res) => {
  res.render('add', {
    title: 'add course',
    isAdd: true,
  });
});

router.post('/', auth, coursesValidators, (req, res) => {
  const { title, price, img } = req.body;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render('add', {
      title: 'add course',
      isAdd: true,
      error: errors.array()[0].msg,
      data: {
        title,
        price,
        img,
      },
    });
  }

  const newCourse = new Course({ title, price, img, userID: req.user._id });

  newCourse
    .save()
    .then(() => {
      res.redirect('/courses');
    })
    .catch((err) => console.log(err));
});

module.exports = router;

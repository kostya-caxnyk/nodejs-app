const { Router } = require('express');
const Courses = require('../models/course');
const Course = require('../models/course');

const router = Router();

router.get('/', (req, res) => {
  res.render('add', {
    title: 'add course',
    isAdd: true,
  });
});

router.post('/', (req, res) => {
  const { title, price, img } = req.body;
  const newCourse = new Course(title, price, img);

  newCourse.save().then(() => {
    res.redirect('/courses');
  });
});

module.exports = router;

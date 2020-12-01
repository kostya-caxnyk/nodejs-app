const { Router } = require('express');
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
  const newCourse = new Course({ title, price, img, userID: req.user._id });

  newCourse
    .save()
    .then(() => {
      res.redirect('/courses');
    })
    .catch((err) => console.log(err));
});

module.exports = router;

const { Router } = require('express');
const { validationResult } = require('express-validator');
const Course = require('../models/course');
const auth = require('../middleware/auth');
const { coursesValidators } = require('../utils/validators.js');

const router = Router();

const isOwner = (course, req) => {
  if (!req.user) {
    return false;
  }
  return course.userID.toString() === req.user._id.toString();
};

router.get('/', async (req, res) => {
  try {
    const courses = await Course.find()
      .lean()
      .populate('userID', 'email name')
      .select('price title img');

    res.render('courses', {
      title: 'courses',
      isCourses: true,
      courses,
      userId: req.user ? req.user._id.toString() : undefinted,
    });
  } catch (e) {
    console.log(e);
  }
});

router.get('/:id', async (req, res) => {
  const course = await Course.findById(req.params.id).lean();

  res.render('course', {
    layout: 'empty',
    title: `Course ${course.title}`,
    course,
  });
});

router.get('/:id/edit', auth, async (req, res) => {
  if (!req.query.allow) {
    return res.redirect('/');
  }

  try {
    const course = await Course.findById(req.params.id).lean();

    if (isOwner(course, req)) {
      res.render('course-edit', {
        title: `Edit Course ${course.title}`,
        course,
      });
    } else {
      res.redirect('/courses');
    }
  } catch (e) {
    console.log(e);
  }
});

router.post('/edit', auth, coursesValidators, async (req, res) => {
  const { id } = req.body;
  delete req.body.id;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).redirect(`/courses/${id}/edit?allow=true`);
  }

  try {
    const course = await Course.findById(id);
    if (!isOwner(course, req)) {
      return res.redirect('/courses');
    }

    Object.assign(course, req.body);
    await course.save();
    res.redirect(`/courses`);
  } catch (e) {
    console.log(e);
  }
});

router.post('/remove', auth, async (req, res) => {
  try {
    await Course.deleteOne({ _id: req.body.id, userID: req.user?._id });
    res.redirect('/courses');
  } catch (e) {
    console.log(e);
  }
});

module.exports = router;

const { Router } = require('express');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const sendgrid = require('nodemailer-sendgrid-transport');
const crypto = require('crypto');
const User = require('../models/user');
const keys = require('../keys');
const regEmail = require('../emails/registration');
const resetEmail = require('../emails/reset');

const router = Router();
const transporter = nodemailer.createTransport(
  sendgrid({
    auth: {
      api_key: keys.GRID_API_KEY,
    },
  }),
);

router.get('/login', (req, res) => {
  res.render('auth/login', {
    title: 'Authorization',
    isLogin: true,
    loginError: req.flash('loginError'),
    registerError: req.flash('registerError'),
  });
});

router.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/auth/login#login');
  });
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const candidate = await User.findOne({ email });

    if (candidate) {
      const areSame = await bcrypt.compare(password, candidate.password);

      if (areSame) {
        req.session.user = candidate;
        req.session.isAuthenticated = true;

        req.session.save((err) => {
          if (err) {
            throw new err();
          }
          res.redirect('/');
        });
      } else {
        req.flash('loginError', `Invalid password`);
        res.redirect('/auth/login');
      }
    } else {
      req.flash('loginError', 'Invalid input, no such user');
      res.redirect('/auth/login#login');
    }
  } catch (e) {
    console.log(e);
  }
});

router.post('/register', async (req, res) => {
  try {
    const { name, email, password, repeat } = req.body;

    if (password !== repeat) {
      req.flash('registerError', "Passwords don't match");
      return res.redirect('/auth/login#register');
    }

    const candidate = await User.findOne({ email });

    if (candidate) {
      req.flash('registerError', 'User with this email already exist');
      res.redirect('/auth/login#register');
    } else {
      const hashPassword = await bcrypt.hash(password, 10);
      const user = new User({ name, email, password: hashPassword, card: { items: [] } });

      await user.save();
      res.redirect('/auth/login#login');
      await transporter.sendMail(regEmail(email));
    }
  } catch (e) {
    console.log(e);
  }
});

router.get('/reset', (req, res) => {
  res.render('auth/reset', {
    title: 'Reset password',
    error: req.flash('error'),
  });
});

router.post('/reset', (req, res) => {
  try {
    crypto.randomBytes(32, async (err, buffer) => {
      if (err) {
        req.flash('error', 'Something went wrong');
        return req.redirect('auth/reset');
      }

      const { email } = req.body;
      const token = buffer.toString('hex');
      const candidate = await User.findOne({ email });

      if (candidate) {
        candidate.resetToken = token;
        candidate.resetTokenExp = Date.now() + 60 * 60 * 1000;
        await candidate.save();

        res.redirect('/auth/login');
        await transporter.sendMail(resetEmail(email, token));
      } else {
        req.flash('error', 'No such user');
        res.redirect('/auth/reset');
      }
    });
  } catch (e) {
    console.log(e);
  }
});

router.get('/password/:token', async (req, res) => {
  const { token } = req.params;
  if (!token) {
    return res.redirect('/auth/login');
  }

  try {
    const user = await User.findOne({
      resetToken: token,
      resetTokenExp: { $gt: Date.now() },
    });

    if (!user) {
      return res.redirect('/auth/login');
    }

    res.render('auth/password', {
      title: 'Recovery Password',
      error: req.flash('error'),
      userId: user._id.toString(),
      token,
    });
  } catch (e) {
    console.log(e);
  }
});

router.post('/password', async (req, res) => {
  const { password, userId, token } = req.body;
  try {
    const user = await User.findOne({
      _id: userId,
      resetToken: token,
      resetTokenExp: { $gt: Date.now() },
    });

    if (user) {
      user.password = await bcrypt.hash(password, 10);
      user.resetToken = undefined;
      user.resetTokenExp = undefined;
      await user.save();
      res.redirect('/auth/login');
    } else {
      req.flash('loginError', 'Token is dead. RIP');
      res.redirect('/auth/login');
    }
  } catch (e) {
    console.log(e);
  }
});

module.exports = router;

const { Router } = require('express');
const Course = require('../models/course');

const router = Router();

const mapCartItems = (cart) => {
  return cart.items.map((c) => ({
    ...c.courseID._doc,
    count: c.count,
    id: c.courseID.id,
  }));
};

const getTotalPrice = (arr) => {
  return arr.reduce((acc, obj) => acc + obj.count * obj.price, 0);
};

router.get('/', async (req, res) => {
  const user = await req.user.populate('cart.items.courseID').execPopulate();

  const courses = mapCartItems(user.cart);
  const price = getTotalPrice(courses);

  res.render('cart', {
    title: 'cart',
    isCart: true,
    courses,
    price,
  });
});

router.post('/add', async (req, res) => {
  const course = await Course.findById(req.body.id).lean();
  await req.user.addToCart(course);
  res.redirect('/cart');
});

router.delete('/remove/:id', async (req, res) => {
  await req.user.removeFromCart(req.params.id);
  const user = await req.user.populate('cart.items.courseID').execPopulate();

  const courses = mapCartItems(user.cart);
  const price = getTotalPrice(courses);
  console.log(courses);
  res.json({ courses, price });
});

module.exports = router;

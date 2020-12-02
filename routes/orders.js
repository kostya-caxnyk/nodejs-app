const { Router } = require('express');
const auth = require('../middleware/auth');
const Order = require('../models/orders');

const router = Router();

router.get('/', auth, async (req, res) => {
  try {
    const orders = await Order.find({ 'user.userId': req.user }).populate('user.userId');

    res.render('orders', {
      title: 'Orders',
      isOrders: true,
      orders: orders.map((o) => ({
        ...o._doc,
        price: o.courses.reduce((acc, c) => acc + c.count * c.course.price, 0),
      })),
    });
  } catch (e) {
    console.log(e);
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const user = await req.user.populate('cart.items.courseID').execPopulate();
    const courses = user.cart.items.map((i) => ({ count: i.count, course: i.courseID._doc }));

    const order = new Order({
      courses,
      user: { name: user.name, userId: user.id },
    });

    await order.save();
    await user.clearCart();
    res.redirect('orders');
  } catch (e) {
    console.log(e);
  }
});

module.exports = router;

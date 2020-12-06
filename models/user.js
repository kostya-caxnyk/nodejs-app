const { Schema, model } = require('mongoose');

const user = new Schema({
  email: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  avatarUrl: String,
  resetToken: String,
  resetTokenExp: Date,
  cart: {
    items: [
      {
        count: {
          type: Number,
          required: true,
          default: 1,
        },
        courseID: {
          type: Schema.Types.ObjectId,
          required: true,
          ref: 'Course',
        },
      },
    ],
  },
});

user.methods.addToCart = function (course) {
  const items = [...this.cart.items];
  const idx = items.findIndex((c) => c.courseID.toString() === course._id.toString());

  if (idx < 0) {
    items.push({ count: 1, courseID: course._id });
  } else {
    items[idx].count++;
  }

  this.cart = { items };
  return this.save();
};

user.methods.removeFromCart = function (id) {
  const items = [...this.cart.items];
  const idx = items.findIndex((c) => c.courseID.toString() === id);

  if (items[idx].count === 1) {
    items.splice(idx, 1);
  } else {
    items[idx].count--;
  }

  this.cart = { items };
  return this.save();
};

user.methods.clearCart = function () {
  this.cart.items = [];
  return this.save();
};

module.exports = model('User', user);

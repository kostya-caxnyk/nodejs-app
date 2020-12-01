const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const Handlebars = require('handlebars');
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access');
const homeRoutes = require('./routes/home');
const coursesRoutes = require('./routes/courses');
const addRoutes = require('./routes/add');
const cartRoutes = require('./routes/cart');
const ordersRoutes = require('./routes/orders');
const authRoutes = require('./routes/auth');
const mongoose = require('mongoose');
const User = require('./models/user');

const app = express();

const hbs = exphbs.create({
  defaultLayout: 'main',
  extname: 'hbs',
  handlebars: allowInsecurePrototypeAccess(Handlebars),
});

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', 'views');

app.use((req, res, next) => {
  User.findById('5fc613fb4dc9113c44696368')
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((e) => console.log(e));
});

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

app.use('/', homeRoutes);
app.use('/courses', coursesRoutes);
app.use('/add', addRoutes);
app.use('/cart', cartRoutes);
app.use('/orders', ordersRoutes);
app.use('/auth', authRoutes);

const PORT = process.env.PORT || 3000;

const start = async () => {
  const url = 'mongodb+srv://kostya:YfZhbwgPm6NcVNcs@cluster0.5ouzx.mongodb.net/shop';

  try {
    await mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    });

    const candidate = await User.findOne();
    if (!candidate) {
      const user = new User({ email: 'caxnyk2002@gmail.com', name: 'Kostya', cart: { items: [] } });
      await user.save();
    }

    app.listen(PORT, () => {
      console.log(`server is running on port ${PORT}`);
    });
  } catch (e) {
    console.log(e);
  }
};

start();

const password = 'YfZhbwgPm6NcVNcs';

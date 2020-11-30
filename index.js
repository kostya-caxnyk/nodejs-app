const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const homeRoutes = require('./routes/home');
const coursesRoutes = require('./routes/courses');
const addRoutes = require('./routes/add');
const cardRoutes = require('./routes/card');
const mongoose = require('mongoose');

const app = express();

const hbs = exphbs.create({
  defaultLayout: 'main',
  extname: 'hbs',
});

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', 'views');

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extened: true }));
app.use('/', homeRoutes);
app.use('/courses', coursesRoutes);
app.use('/add', addRoutes);
app.use('/card', cardRoutes);

const PORT = process.env.PORT || 3000;

const start = async () => {
  const url =
    'mongodb+srv://kostya:YfZhbwgPm6NcVNcs@cluster0.5ouzx.mongodb.net/<dbname>?retryWrites=true&w=majority';

  try {
    await mongoose.connect(url, { useNewUrlParser: true });

    app.listen(PORT, () => {
      console.log(`server is running on port ${PORT}`);
    });
  } catch (e) {
    console.log(e);
  }
};

start();

const password = 'YfZhbwgPm6NcVNcs';
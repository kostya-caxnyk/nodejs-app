const { countReset } = require('console');
const fs = require('fs');
const path = require('path');

const pathToData = path.join(__dirname, '..', 'data', 'card.json');

class Card {
  static async add(course) {
    let { courses, price } = await Card.fetch();
    const idx = courses.findIndex((c) => c.id === course.id);

    if (idx < 0) {
      course.count = 1;
      courses.push(course);
    } else {
      courses[idx].count++;
    }

    price += +course.price;

    return new Promise((res, rej) => {
      fs.writeFile(pathToData, JSON.stringify({ courses, price }), (err) => {
        if (err) {
          rej(err);
        } else {
          res();
        }
      });
    });
  }

  static async remove(id) {
    let { courses, price } = await Card.fetch();

    const idx = courses.findIndex((c) => c.id === id);
    price -= courses[idx].price;

    if (courses[idx].count === 1) {
      courses = [...courses.slice(0, idx), ...courses.slice(idx + 1)];
    } else {
      courses[idx].count--;
    }

    return new Promise((res, rej) => {
      fs.writeFile(pathToData, JSON.stringify({ courses, price }), (err) => {
        if (err) {
          rej(err);
        } else {
          res({ courses, price });
        }
      });
    });
  }

  static fetch() {
    return new Promise((res, rej) => {
      fs.readFile(pathToData, 'utf-8', (err, content) => {
        if (err) {
          rej(err);
        } else {
          res(JSON.parse(content));
        }
      });
    });
  }
}

module.exports = Card;

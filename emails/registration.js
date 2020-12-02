const keys = require('../keys');

module.exports = (email) => {
  return {
    to: email,
    from: keys.EMAIL_FROM,
    subject: 'You are successfully registered, congratulations!',
    html: `
      <h1>Welcome to our shop</h1>
      <p>You have successfully made your account with this email - ${email}</p>
      <a href=${keys.BASE_URL}>Shop of courses</a>
    `,
  };
};

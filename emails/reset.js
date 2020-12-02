const keys = require('../keys');

module.exports = (email, token) => {
  return {
    to: email,
    from: keys.EMAIL_FROM,
    subject: 'Password Recovery in online shop',
    html: `
      <h1>Did you forget your password?</h1>
      <p>If no, just ignore this letter</p>
      <p><a href='${keys.BASE_URL}/auth/password/${token}'>Reset the password</a></p>
      <hr/>
      <a href=${keys.BASE_URL}>Shop of courses</a>
    `,
  };
};

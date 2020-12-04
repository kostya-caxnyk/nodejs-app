module.exports = {
  ifeq(a, b, options) {
    if (a === b.toString()) {
      return options.fn(this);
    }
    return options.inverse(this);
  },
};

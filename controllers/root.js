const jwt = require('jsonwebtoken');
const tokenSecret = require('../config').tokenSecret;

module.exports = ({ User }, render) => {
  return {
    getRoot: async (ctx, next) => {
      await render(ctx, 'upload.html')
    },

  }
}

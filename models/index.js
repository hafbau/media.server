const decorate = require('../utils/model_decorator');

module.exports = function(db) {
  return {
    File: decorate(require('./file')(db)),
  }
}

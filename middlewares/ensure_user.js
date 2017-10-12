const jwt = require('jsonwebtoken');
const tokenSecret = require('../config').tokenSecret;

module.exports = () => async (ctx, next) => {
  
  try {
  
    return next();
  }
  catch (err) {
    console.log('error in ensure user middleware', err)    
    return next();
  }

}

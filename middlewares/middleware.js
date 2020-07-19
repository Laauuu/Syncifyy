const helper = require('../helpers/errorFunctions');
const jwt = require('jsonwebtoken');

function isAuthorized(req, res, next) {
  if (!req.headers.authorization) {
    // checks header for token
    helper.httpError400(res, 'Please login!');
  } else {
    jwt.verify(
      req.headers.authorization,
      process.env.TOKEN_SECRET,
      (err, data) => {
        // data is user information
        if (err) {
          helper.httpError500(res, err);
        } else {
          req.user = data;
          next();
        }
      }
    );
  }
}

module.exports = {
  isAuthorized,
};

const helper = require('../helpers/errorFunctions');
const jwt = require('jsonwebtoken');

function isAuthorized(req, res, next) {
  if (!req.headers.authorization) {
    helper.httpError400(res, 'Please proceed to login!');
    res.end();
  } else {
    jwt.verify(
      req.headers.authorization,
      process.env.TOKEN_SECRET,
      (err, data) => {
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

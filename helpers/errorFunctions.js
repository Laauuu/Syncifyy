function httpError400(res, errorMessage) {
  const error = new Error(errorMessage);
  res.status(400);
  res.json(error.message);
}

function httpError500(res, errorMessage) {
  const error = new Error(errorMessage);
  res.status(500);
  res.json(error.message);
}

function httpError409(res, errorMessage) {
  const error = new Error(errorMessage);
  res.status(409);
  res.json(error.message);
}

module.exports = {
  httpError400,
  httpError500,
  httpError409,
};

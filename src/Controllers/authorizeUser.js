const authorizeUser = function (req, res, next) {
  const { authorization } = req.headers;

  const basicEncode = Buffer.from(authorization.slice(5), 'base64').toString(
    'ascii'
  );
  const username = basicEncode.slice(0, basicEncode.length - 1);

  if (username === 'one') res.locals.librarian = true;
  else res.locals.librarian = false;
  return next();
};

module.exports = { authorizeUser };

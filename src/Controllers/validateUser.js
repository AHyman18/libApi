const validateUser = function (req, res, next) {
  const { authorization } = req.headers;
  const basicEncode = Buffer.from(authorization.slice(5), 'base64').toString('ascii');
  const username = basicEncode.slice(0, basicEncode.length - 1);

  switch (username) {
    case 'two':
      res.locals.user = 2;
      break;
    case 'three':
      res.locals.user = 3;
      break;
    case 'four':
      res.locals.user = 4;
      break;
    default:
      return res.send('Please enter valid User');
  }

  return next();
};

module.exports = { validateUser };



//ssl temporarily skipped

module.exports = function (req, res, next) {
  'use strict';
  var host = req.get('Host');

  if (host === 'zikoko-live.herokuapp.com') {
    return res.redirect(301, ['http://', 'zikoko.com', req.url].join(''));
  }

  if ((req.headers['x-forwarded-proto'] === 'https') && (process.env.NODE_ENV === 'production')) {
    return res.redirect(301, ['http://', host, req.url].join(''));
  }

  return next();
};

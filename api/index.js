const user = require('./handlers/user');

exports.register = (plugin, options, next) => {

  plugin.route([
    { method: 'POST', path: '/user', config: user.post }
  ]);

  next();
};

exports.register.attributes = {
  name: 'api'
};
//rjmreis
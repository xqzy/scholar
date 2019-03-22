use 'strict';

module.exports = {
  env: 'PROD',
  db:  'mongodb://localhost/prod',
  port:  process.env.PORT || 4000,
};
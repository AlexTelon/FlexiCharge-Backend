const jwtAuthz = require('express-jwt-authz');

const checkIfAdmin = jwtAuthz(['Admins'], { customScopeKey: 'cognito:groups' });

module.exports = checkIfAdmin
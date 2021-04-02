// imports
const router = require('express').Router();
const ctrl = require('../controllers');

const authRequired = require('../middleware/authRequired');

// routes
router.post('/register', ctrl.auth.register);
router.post('/login', ctrl.auth.login);
router.get('/profile', authRequired, ctrl.auth.profile);

// exports
module.exports = router;

const router = require('express').Router();
const ctrl = require('../controllers');


// router.get('/', ctrl.feeds.index);
// router.get('/:id', ctrl.feeds.show);
router.post('/', ctrl.users.signUp);
// router.put('/:id', ctrl.feeds.update);
// router.delete('/:id', ctrl.feeds.destroy);


module.exports = router;

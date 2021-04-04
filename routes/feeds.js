const router = require('express').Router();
const ctrl = require('../controllers');

router.get('/', ctrl.feeds.index);
router.get('/:id/:filterStrength', ctrl.feeds.show);
router.post('/', ctrl.feeds.create);
router.put('/update', ctrl.feeds.update);
router.delete('/destroy', ctrl.feeds.destroy);

module.exports = router;

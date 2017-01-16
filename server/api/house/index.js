'use strict';

var express = require('express');
var controller = require('./house.controller');

var router = express.Router();

router.get('/', controller.index);
router.get('/:id', controller.show);
router.get('/display/leaderboard/', controller.leaderboard);
router.post('/:i', controller.create);
router.put('/:id', controller.upsert);
router.patch('/:id', controller.patch);
router.delete('/:id', controller.destroy);

module.exports = router;
//# sourceMappingURL=index.js.map

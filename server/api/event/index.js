'use strict';

var _auth = require('../../auth/auth.service');

var auth = _interopRequireWildcard(_auth);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var express = require('express');
var controller = require('./event.controller');


var router = express.Router();

// router.get('/', controller.index);
router.get('/:id', controller.show);

router.get('/isRegistered/:id', auth.isAuthenticated(), controller.isRegistered);
router.post('/', auth.hasRole('admin'), controller.create);
router.get('/getRegisteredUsers/:id', auth.hasRole('admin'), controller.getRegisteredUsers);
router.post('/genExcel/:id', auth.hasRole('admin'), controller.convertToExcel);
// router.put('/:id', auth.hasRole('admin'), controller.upsert);
router.put('/:id', auth.hasRole('admin'), controller.update);
router.put('/register/:id', auth.isAuthenticated(), controller.register);
// router.patch('/:id', controller.patch);
// router.delete('/:id', auth.hasRole('admin'), controller.destroy);

module.exports = router;
//# sourceMappingURL=index.js.map

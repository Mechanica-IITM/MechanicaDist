'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.index = index;
exports.create = create;
exports.show = show;
exports.destroy = destroy;
exports.changePassword = changePassword;
exports.me = me;
exports.authCallback = authCallback;

var _user = require('./user.model');

var _user2 = _interopRequireDefault(_user);

var _house = require('../house/house.model');

var _house2 = _interopRequireDefault(_house);

var _environment = require('../../config/environment');

var _environment2 = _interopRequireDefault(_environment);

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function validationError(res, statusCode) {
  statusCode = statusCode || 422;
  return function (err) {
    return res.status(statusCode).json(err);
  };
}

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function (err) {
    return res.status(statusCode).send(err);
  };
}

function respondWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function (entity) {
    if (entity) {
      return res.status(statusCode).json(entity);
    }
    return null;
  };
}

/**
 * Get list of users
 * restriction: 'admin'
 */
function index(req, res) {
  return _user2.default.find({}, '-salt -password').exec().then(function (users) {
    res.status(200).json(users);
  }).catch(handleError(res));
}

/**
 * Creates a new user
 */
function create(req, res) {

  if (req.body.rollNumber) {
    var rollNumber = req.body.rollNumber.split(' ');
    rollNumber = rollNumber.join('').toUpperCase();
    console.log(rollNumber, 222222);
    _house2.default.findOne({ "team.member": rollNumber }).exec().then(function (house) {

      var newUser = new _user2.default(req.body);
      console.log(house, 32333333333);

      if (house) newUser.house = house._id;

      newUser.provider = 'local';
      newUser.role = 'user';
      newUser.save().then(function (user) {
        var token = _jsonwebtoken2.default.sign({ _id: user._id }, _environment2.default.secrets.session, {
          expiresIn: 60 * 60 * 5
        });
        res.json({ token: token });
      }).catch(validationError(res));
    });
  } else return res.send(400);
}

/**
 * Get a single user
 */
function show(req, res, next) {
  var userId = req.params.id;

  return _user2.default.findById(userId).exec().then(function (user) {
    if (!user) {
      return res.status(404).end();
    }
    res.json(user.profile);
  }).catch(function (err) {
    return next(err);
  });
}

/**
 * Deletes a user
 * restriction: 'admin'
 */
function destroy(req, res) {
  return _user2.default.findByIdAndRemove(req.params.id).exec().then(function () {
    res.status(204).end();
  }).catch(handleError(res));
}

/**
 * Change a users password
 */
function changePassword(req, res) {
  var userId = req.user._id;
  var oldPass = String(req.body.oldPassword);
  var newPass = String(req.body.newPassword);

  return _user2.default.findById(userId).exec().then(function (user) {
    if (user.authenticate(oldPass)) {
      user.password = newPass;
      return user.save().then(function () {
        res.status(204).end();
      }).catch(validationError(res));
    } else {
      return res.status(403).end();
    }
  });
}

/**
 * Get my info
 */
function me(req, res, next) {
  var userId = req.user._id;

  return _user2.default.findOne({ _id: userId }, '-salt -password').populate('house').exec().then(function (user) {
    // don't ever give out the password or salt
    if (!user) {
      return res.status(401).end();
    }
    res.json(user);
  }).catch(function (err) {
    return next(err);
  });
}
/**
 * Authentication callback
 */
function authCallback(req, res) {
  res.redirect('/');
}
//# sourceMappingURL=user.controller.js.map

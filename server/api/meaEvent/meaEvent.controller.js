/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/meaEvents              ->  index
 * POST    /api/meaEvents              ->  create
 * GET     /api/meaEvents/:id          ->  show
 * PUT     /api/meaEvents/:id          ->  upsert
 * PATCH   /api/meaEvents/:id          ->  patch
 * DELETE  /api/meaEvents/:id          ->  destroy
 */

'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

exports.index = index;
exports.show = show;
exports.create = create;
exports.upsert = upsert;
exports.patch = patch;
exports.register = register;
exports.destroy = destroy;

var _fastJsonPatch = require('fast-json-patch');

var _fastJsonPatch2 = _interopRequireDefault(_fastJsonPatch);

var _meaEvent = require('./meaEvent.model');

var _meaEvent2 = _interopRequireDefault(_meaEvent);

var _house = require('../house/house.model');

var _house2 = _interopRequireDefault(_house);

var _user = require('../user/user.model');

var _user2 = _interopRequireDefault(_user);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function respondWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function (entity) {
    if (entity) {
      return res.status(statusCode).json(entity);
    }
    return null;
  };
}

function patchUpdates(patches) {
  return function (entity) {
    try {
      _fastJsonPatch2.default.apply(entity, patches, /*validate*/true);
    } catch (err) {
      return _promise2.default.reject(err);
    }

    return entity.save();
  };
}

function removeEntity(res) {
  return function (entity) {
    if (entity) {
      return entity.remove().then(function () {
        res.status(204).end();
      });
    }
  };
}

function handleEntityNotFound(res) {
  return function (entity) {
    if (!entity) {
      res.status(404).end();
      return null;
    }
    return entity;
  };
}

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function (err) {
    res.status(statusCode).send(err);
  };
}

// Gets a list of MeaEvents
function index(req, res) {
  return _meaEvent2.default.find().exec().then(respondWithResult(res)).catch(handleError(res));
}

// Gets a single MeaEvent from the DB
function show(req, res) {
  return _meaEvent2.default.findById(req.params.id).exec().then(handleEntityNotFound(res)).then(respondWithResult(res)).catch(handleError(res));
}

// Creates a new MeaEvent in the DB
function create(req, res) {
  return _meaEvent2.default.create(req.body).then(respondWithResult(res, 201)).catch(handleError(res));
}

// Upserts the given MeaEvent in the DB at the specified ID
function upsert(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  return _meaEvent2.default.findOneAndUpdate(req.params.id, req.body, { upsert: true, setDefaultsOnInsert: true, runValidators: true }).exec().then(respondWithResult(res)).catch(handleError(res));
}

// Updates an existing MeaEvent in the DB
function patch(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  return _meaEvent2.default.findById(req.params.id).exec().then(handleEntityNotFound(res)).then(patchUpdates(req.body)).then(respondWithResult(res)).catch(handleError(res));
}

/**
 * Add registered event
 */

function register(req, res) {

  // Add user to event
  return _meaEvent2.default.findOneAndUpdate({ _id: req.params.eventId }, { $push: { users: { user: req.user._id, score: 0 } } }, { upsert: true, setDefaultsOnInsert: true }).exec().then(function (event) {

    // Add event to house
    return _house2.default.findOneAndUpdate({ name: req.user.house }, { $push: { meaEvents: { user: req.user._id, meaEvent: event._id, score: 0 } } }, { upsert: true, setDefaultsOnInsert: true, runValidators: true }).exec().then(respondWithResult(res)).catch(handleError(res));
  }).catch(handleError(res));
}

// Deletes a MeaEvent from the DB
function destroy(req, res) {
  return _meaEvent2.default.findById(req.params.id).exec().then(handleEntityNotFound(res)).then(removeEntity(res)).catch(handleError(res));
}
//# sourceMappingURL=meaEvent.controller.js.map

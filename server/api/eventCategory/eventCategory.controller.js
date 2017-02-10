/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/eventCategorys              ->  index
 * POST    /api/eventCategorys              ->  create
 * GET     /api/eventCategorys/:id          ->  show
 * PUT     /api/eventCategorys/:id          ->  upsert
 * PATCH   /api/eventCategorys/:id          ->  patch
 * DELETE  /api/eventCategorys/:id          ->  destroy
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
exports.update = update;
exports.patch = patch;
exports.destroy = destroy;

var _fastJsonPatch = require('fast-json-patch');

var _fastJsonPatch2 = _interopRequireDefault(_fastJsonPatch);

var _validator = require('validator');

var _validator2 = _interopRequireDefault(_validator);

var _eventCategory = require('./eventCategory.model');

var _eventCategory2 = _interopRequireDefault(_eventCategory);

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

// Gets a list of EventCategorys
function index(req, res) {
  return _eventCategory2.default.find().populate('events.event').exec().then(respondWithResult(res)).catch(handleError(res));
}

// Gets a single EventCategory from the DB
function show(req, res) {
  if (!_validator2.default.isMongoId(req.params.id + '')) return res.status(400).send("Invalid Id");

  return _eventCategory2.default.findById(req.params.id).exec().then(handleEntityNotFound(res)).then(respondWithResult(res)).catch(handleError(res));
}

// Creates a new EventCategory in the DB
function create(req, res) {
  return _eventCategory2.default.create(req.body).then(respondWithResult(res, 201)).catch(handleError(res));
}

// Upserts the given EventCategory in the DB at the specified ID
function upsert(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  return _eventCategory2.default.findOneAndUpdate(req.params.id, req.body, { upsert: true, setDefaultsOnInsert: true, runValidators: true }).exec().then(respondWithResult(res)).catch(handleError(res));
}
function update(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  if (!_validator2.default.isMongoId(req.params.id + '')) return res.status(400).send("Invalid Id");

  return _eventCategory2.default.findById(req.params.id).exec().then(handleEntityNotFound(res)).then(function (eventCategory) {
    eventCategory.name = req.body.name;
    eventCategory.info = req.body.info;
    eventCategory.imgURL = req.body.imgURL;
    eventCategory.save().then(respondWithResult(res)).catch(handleError(res));
  }).catch(handleError(res));
}

// Updates an existing EventCategory in the DB
function patch(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  return _eventCategory2.default.findById(req.params.id).exec().then(handleEntityNotFound(res)).then(patchUpdates(req.body)).then(respondWithResult(res)).catch(handleError(res));
}

// Deletes a EventCategory from the DB
function destroy(req, res) {
  return _eventCategory2.default.findById(req.params.id).exec().then(handleEntityNotFound(res)).then(removeEntity(res)).catch(handleError(res));
}
//# sourceMappingURL=eventCategory.controller.js.map

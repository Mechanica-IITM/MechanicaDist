/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/events              ->  index
 * POST    /api/events              ->  create
 * GET     /api/events/:id          ->  show
 * PUT     /api/events/:id          ->  upsert
 * PATCH   /api/events/:id          ->  patch
 * DELETE  /api/events/:id          ->  destroy
 */

'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

exports.index = index;
exports.show = show;
exports.isRegistered = isRegistered;
exports.create = create;
exports.upsert = upsert;
exports.update = update;
exports.register = register;
exports.patch = patch;
exports.destroy = destroy;

var _fastJsonPatch = require('fast-json-patch');

var _fastJsonPatch2 = _interopRequireDefault(_fastJsonPatch);

var _validator = require('validator');

var _validator2 = _interopRequireDefault(_validator);

var _event = require('./event.model');

var _event2 = _interopRequireDefault(_event);

var _eventCategory = require('../eventCategory/eventCategory.model');

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
    console.log(err);
    res.status(statusCode).send(err);
  };
}

// Gets a list of Events
function index(req, res) {
  return _event2.default.find().exec().then(respondWithResult(res)).catch(handleError(res));
}

// Gets a single Event from the DB
function show(req, res) {
  console.log(req.params.id);

  if (!_validator2.default.isMongoId(req.params.id + '')) return res.status(400).send("Invalid Id");

  return _event2.default.findById(req.params.id).exec().then(handleEntityNotFound(res)).then(respondWithResult(res)).catch(handleError(res));
}

// Gets a single Event from the DB
function isRegistered(req, res) {

  if (!_validator2.default.isMongoId(req.params.id + '')) return res.status(400).send("Invalid Id");

  return _event2.default.findById(req.params.id).exec().then(handleEntityNotFound(res)).then(function (event) {
    var isRegistered = false;
    isRegistered = event.registered.find(function (user) {
      if (user.user.equals(req.user._id)) return true;
      return false;
    });
    return res.json(isRegistered);
  }).catch(handleError(res));
}

// Creates a new Event in the DB
function create(req, res) {
  console.log(req.body);
  return _event2.default.create(req.body).then(function (event) {
    _eventCategory2.default.findById(event.eventCategory).exec().then(handleEntityNotFound(res)).then(function (eventCategory) {
      console.log(eventCategory);
      eventCategory.events.push({ event: event._id });
      eventCategory.save().then(respondWithResult(res, 201)).catch(handleError(res));
    }).catch(handleError(res));
  }).catch(handleError(res));
}

// Upserts the given Event in the DB at the specified ID
function upsert(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  console.log(req.body);
  return _event2.default.findOneAndUpdate(req.params.id, req.body, { upsert: true, new: true, setDefaultsOnInsert: true, runValidators: true }).exec().then(respondWithResult(res)).catch(handleError(res));
}

function update(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  if (!_validator2.default.isMongoId(req.params.id + '')) return res.status(400).send("Invalid Id");

  return _event2.default.findById(req.params.id).exec().then(handleEntityNotFound(res)).then(function (event) {
    event.name = req.body.name;
    event.info = req.body.info;
    event.faq = req.body.faq;
    event.rules = req.body.rules;
    event.awards = req.body.awards;
    event.date = new Date(req.body.date);
    event.startTime = new Date(req.body.startTime);
    event.endTime = new Date(req.body.endTime);
    event.venue = req.body.venue;
    event.poster = req.body.poster;
    event.save().then(respondWithResult(res)).catch(handleError(res));
  }).catch(handleError(res));
}

function register(req, res) {
  if (!_validator2.default.isMongoId(req.params.id + '')) return res.status(400).send("Invalid Id");

  return _event2.default.findById(req.params.id).exec().then(function (event) {
    event.registered.push({ user: req.user._id });
    event.save().then(respondWithResult(res)).catch(handleError(res));
  }).catch(handleError(res));
}
// Updates an existing Event in the DB
function patch(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  return _event2.default.findById(req.params.id).exec().then(handleEntityNotFound(res)).then(patchUpdates(req.body)).then(respondWithResult(res)).catch(handleError(res));
}

// Deletes a Event from the DB
function destroy(req, res) {
  return _event2.default.findById(req.params.id).exec().then(handleEntityNotFound(res)).then(removeEntity(res)).catch(handleError(res));
}
//# sourceMappingURL=event.controller.js.map

/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/houses              ->  index
 * POST    /api/houses              ->  create
 * GET     /api/houses/:id          ->  show
 * PUT     /api/houses/:id          ->  upsert
 * PATCH   /api/houses/:id          ->  patch
 * DELETE  /api/houses/:id          ->  destroy
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
exports.addNextMem = addNextMem;
exports.upsert = upsert;
exports.patch = patch;
exports.destroy = destroy;

var _fastJsonPatch = require('fast-json-patch');

var _fastJsonPatch2 = _interopRequireDefault(_fastJsonPatch);

var _house = require('./house.model');

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

function randomString(length, chars) {
  var result = '';
  for (var i = length; i > 0; --i) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }return result;
}

// Gets a list of Houses
function index(req, res) {
  return _house2.default.find().populate('team commander').exec().then(respondWithResult(res)).catch(handleError(res));
}

// Gets a single House from the DB
function show(req, res) {
  return _house2.default.findById(req.params.id).populate('team').exec().then(handleEntityNotFound(res)).then(respondWithResult(res)).catch(handleError(res));
}

// Creates a new House in the DB
function create(req, res) {

  var i = req.params.i;
  var house = {
    name: form[i].House_Name,
    team: []
  };
  var commanderEmail = form[i].commanderRoll + '@smail.iitm.ac.in';
  _user2.default.create({
    name: form[i].commanderName,
    phoneNumber: form[i].commanderPh,
    rollNumber: form[i].commanderRoll,
    email: commanderEmail,
    password: randomString(8, 'abcdefghijklmnopqrstuvwxyz'),
    house: form[i].House_Name
  }).then(function (response) {
    house.team.push(response._id);
    house.commander = response._id;
    addNextMem(9, i, house);
    return res.send(200);
  }).catch(function (err) {
    console.log(form[i].commanderRoll, 'commander\n');
    return res.send(500);
  });
}

function addNextMem(j, i, house) {
  if (form[i].hasOwnProperty('TeamMem' + j)) {
    var property = 'TeamMem' + j;
    var email = form[i][property] + '@smail.iitm.ac.in';
    _user2.default.create({
      name: form[i][property],
      rollNumber: form[i][property],
      email: email,
      password: randomString(8, 'abcdefghijklmnopqrstuvwxyz'),
      house: form[i].House_Name
    }).then(function (response) {
      house.team.push(response._id);
      // console.log(house.team,j);
      if (j == 1) {
        _house2.default.create(house).then(function (response) {});
      }
      if (j > 0) addNextMem(j - 1, i, house);else return 0;
    }).catch(function (err) {
      console.log(form[i][property], 'teammem', err.message);
    });
  } else addNextMem(j - 1, i, house);
}
// Upserts the given House in the DB at the specified ID
function upsert(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  return _house2.default.findOneAndUpdate(req.params.id, req.body, { upsert: true, setDefaultsOnInsert: true, runValidators: true }).exec().then(respondWithResult(res)).catch(handleError(res));
}

// Updates an existing House in the DB
function patch(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  return _house2.default.findById(req.params.id).exec().then(handleEntityNotFound(res)).then(patchUpdates(req.body)).then(respondWithResult(res)).catch(handleError(res));
}

// Deletes a House from the DB
function destroy(req, res) {
  return _house2.default.findById(req.params.id).exec().then(handleEntityNotFound(res)).then(removeEntity(res)).catch(handleError(res));
}

var form = [{
  "Timestamp": "9/23/2016 19:19:55",
  "House_Name": "HORIZON",
  "commanderName": "GAURAV PATIL",
  "commanderRoll": "ME16B156",
  "commanderPh": "9423276337",
  "TeamMem1": "ME16B148",
  "TeamMem2": "ME16B121",
  "TeamMem3": "ME16B150",
  "TeamMem4": "ME16B128",
  "TeamMem5": "ME16B112",
  "TeamMem6": "ME16B158",
  "TeamMem7": "ME16B145",
  "TeamMem8": "ME16B165",
  "TeamMem9": "ME16B101"
}, {
  "Timestamp": "9/24/2016 13:19:38",
  "House_Name": "SNOW LEOPARDS",
  "commanderName": "YASHWANTH",
  "commanderRoll": "ME15B143",
  "commanderPh": "9941510816",
  "TeamMem1": "ME15B113",
  "TeamMem2": "ME15B142",
  "TeamMem3": "ME15B128",
  "TeamMem4": "ME15B129",
  "TeamMem5": "ME15B093",
  "TeamMem6": "ME15B091",
  "TeamMem7": "ME15B116",
  "TeamMem8": "ME15B114"
}, {
  "Timestamp": "9/24/2016 14:52:08",
  "House_Name": "Screws Loose",
  "commanderName": "Maneesh",
  "commanderRoll": "Me16b118",
  "commanderPh": "8500569942",
  "TeamMem1": "Me16b113",
  "TeamMem2": "Me16b115",
  "TeamMem3": "Me16b116",
  "TeamMem4": "Me16b122",
  "TeamMem5": "Me16b157",
  "TeamMem6": "Me16b137",
  "TeamMem7": "Me16b136",
  "TeamMem8": "Me16b171",
  "TeamMem9": "Me16b160"
}, {
  "Timestamp": "9/24/2016 19:10:23",
  "House_Name": "Excelsiors",
  "commanderName": "Suraj",
  "commanderRoll": "ME13B094",
  "commanderPh": "9840846679",
  "TeamMem1": "ME13B077",
  "TeamMem2": "ME13B036",
  "TeamMem3": "ME13B065",
  "TeamMem4": "ME13B067",
  "TeamMem5": "ME13B039",
  "TeamMem6": "ME13B144",
  "TeamMem7": "ME13B011",
  "TeamMem8": "ME13B034",
  "TeamMem9": "ME13B063"
}];
//# sourceMappingURL=house.controller.js.map

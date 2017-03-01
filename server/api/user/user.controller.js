"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.index = index;
exports.create = create;
exports.setHighScore = setHighScore;
exports.getHighScore = getHighScore;
exports.setScoreZero = setScoreZero;
exports.contacts = contacts;
exports.spons = spons;
exports.show = show;
exports.destroy = destroy;
exports.changePassword = changePassword;
exports.me = me;
exports.authCallback = authCallback;

var _user = require("./user.model");

var _user2 = _interopRequireDefault(_user);

var _house = require("../house/house.model");

var _house2 = _interopRequireDefault(_house);

var _validator = require("validator");

var _validator2 = _interopRequireDefault(_validator);

var _environment = require("../../config/environment");

var _environment2 = _interopRequireDefault(_environment);

var _jsonwebtoken = require("jsonwebtoken");

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
 * restriction: "admin"
 */
function index(req, res) {
  return _user2.default.find({}, "-salt -password").exec().then(function (users) {
    res.status(200).json(users);
  }).catch(handleError(res));
}

/**
 * Creates a new user
 */
function create(req, res) {

  if (req.body.rollNumber) {
    var rollNumber = req.body.rollNumber.split(" ");
    rollNumber = rollNumber.join("").toUpperCase();
    console.log(rollNumber, 222222);
    _house2.default.findOne({ "team.member": rollNumber }).exec().then(function (house) {

      var newUser = new _user2.default(req.body);
      console.log(house, 32333333333);

      if (house) newUser.house = house._id;

      newUser.provider = "local";
      newUser.role = "user";
      newUser.save().then(function (user) {
        var token = _jsonwebtoken2.default.sign({ _id: user._id }, _environment2.default.secrets.session, {
          expiresIn: 60 * 60 * 5
        });
        res.json({ token: token });
      }).catch(validationError(res));
    });
  } else return res.send(400);
}

function setHighScore(req, res, next) {
  console.log(req.body.score);
  if (req.user.highscore < req.body.score) req.user.highscore = req.body.score;
  req.user.save().then(respondWithResult(res)).catch(handleError(res));
}

function getHighScore(req, res, next) {
  _user2.default.find({}, "name highscore college").sort({ highscore: -1 }).limit(3).then(respondWithResult(res)).catch(handleError(res));
}

function setScoreZero(req, res, next) {
  console.log("here");
  _user2.default.update({}, { $set: { highscore: 0 } }, { multi: true }).then(respondWithResult(res)).catch(handleError(res));
}

function contacts(req, res) {
  var contacts = [{
    "type": "Secretary",
    "profile": [{ "name": "M Vidyadhar", "email": "m.vidyadhar95@gmail.com", "phone": "9952044531" }, { "name": "S Chandra vadan", "email": "scvchandras@gmail.com", "phone": "7981487567" }] }, {
    "type": "Joint Secretary",
    "profile": [{ "name": "Ankit Jain", "email": "bhaiji.ankitjain1993@gmail.com", "phone": "9043807215" }]
  }, {
    "type": "Events",
    "profile": [{ "name": "K Akhil", "email": "akhilkollu96@gmail.com", "phone": "9176493264" }, { "name": "M V Suhaas", "email": "suhaasmekala@gmail.com", "phone": "8220154858" }]
  }, {
    "type": "Student Relations",
    "profile": [{ "name": "Naveen Kanna M", "email": "naveenkanna28@gmail.com", "phone": "8903940256" }, { "name": "T Sumanth Kalyan", "email": "sumanth.kalyan79@gmail.com", "phone": "9790465204" }]
  }, {
    "type": "Sponsorship & Public Relations",
    "profile": [{ "name": "Hitesh Malla", "email": "hitesh.m95@gmail.com", "phone": "9087863969" }, { "name": "Kartheek K", "email": "kartheek301096@gmail.com", "phone": "9677077500" }]
  }, {
    "type": "Web & Mobile Operations",
    "profile": [{ "name": "K Venkat Teja", "email": "teja.kunisetty@gmail.com", "phone": "7200317939" }]
  }, {
    "type": "Design & Media",
    "profile": [{ "name": "M Ravi Theja", "email": "ravithejamavuri@gmail.com ", "phone": "9790464008" }]
  }, {
    "type": "Finance",
    "profile": [{ "name": "B Bhanu Mitra", "email": "bhanumitrab@gmail.com", "phone": "9087863231" }, { "name": "S Maneesha Devi", "email": "rajsridevi598@gmail.com", "phone": "9790469606" }]
  }, {
    "type": "Facilities & Requirements",
    "profile": [{ "name": "Cesh J", "email": "ceshcool@gmail.com", "phone": "9940451199" }]
  }, {
    "type": "QMS",
    "profile": [{ "name": "S Bharath", "email": "rocky.bharath1997@gmail.com", "phone": "9791336202" }]
  }];

  return res.json(contacts);
}
function spons(req, res) {
  var spons = [{ title: "Title Sponsor" }, { title: "Merchandise Partner" }, { title: "Design Partner" }, { title: "Events Partner" }, { title: "Education Partner", num: [1, 2, 3] }, { title: "Knowledge Partner" }, { title: "Professional Training Partner" }, { title: "Workshop Partner" }, { title: "Travel Partner" }, { title: "Student Opportunity Partner" }, { title: "Entertainment Partner" }, { title: "Ticketing Partner" }, { title: "Online Media Partner", num: [1, 2] }, { title: "Finance Partner" }];
  return res.json(spons);
}

/**
 * Get a single user
 */
function show(req, res, next) {
  if (!_validator2.default.isMongoId(req.params.id + "")) return res.status(400).send("Invalid Id");

  var userId = req.params.id;

  return _user2.default.findById(userId).exec().then(function (user) {
    if (!user) {
      return res.status(404).end();
    }
    res.json(user.profileDetails);
  }).catch(function (err) {
    return next(err);
  });
}

/**
 * Deletes a user
 * restriction: "admin"
 */
function destroy(req, res) {
  if (!_validator2.default.isMongoId(req.params.id + "")) return res.status(400).send("Invalid Id");

  return _user2.default.findByIdAndRemove(req.params.id).exec().then(function () {
    res.status(204).end();
  }).catch(handleError(res));
}

/**
 * Change a users password
 */
function changePassword(req, res) {
  if (!_validator2.default.isMongoId(req.user._id + "")) return res.status(400).send("Invalid Id");

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
  if (!_validator2.default.isMongoId(req.user._id + "")) return res.status(400).send("Invalid Id");
  var userId = req.user._id;

  return _user2.default.findOne({ _id: userId }, "-salt -password").populate("house").exec().then(function (user) {
    // don"t ever give out the password or salt
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
  res.redirect("/");
}
//# sourceMappingURL=user.controller.js.map

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
exports.leaderboard = leaderboard;
exports.create = create;
exports.addNextMem = addNextMem;
exports.upsert = upsert;
exports.patch = patch;
exports.destroy = destroy;

var _fastJsonPatch = require('fast-json-patch');

var _fastJsonPatch2 = _interopRequireDefault(_fastJsonPatch);

var _house = require('./house.model');

var _house2 = _interopRequireDefault(_house);

var _validator = require('validator');

var _validator2 = _interopRequireDefault(_validator);

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
  return _house2.default.find().then(respondWithResult(res)).catch(handleError(res));
}

// Gets a single House from the DB
function show(req, res) {
  if (!_validator2.default.isMongoId(req.params.id + '')) return res.status(400).send("Invalid Id");

  return _house2.default.findById(req.params.id).then(handleEntityNotFound(res)).then(respondWithResult(res)).catch(handleError(res));
}

// Leaderboard
function leaderboard(req, res) {

  return _house2.default.find().select('name totalScore').sort({ totalScore: -1 }).exec().then(respondWithResult(res)).catch(handleError(res));
}

// Creates a new House in the DB
function create(req, res) {

  // Adds house 
  // var array = [];
  // for(var i=0;i<form.length;++i){
  //   for(var j=0; j<10;++j){
  //     var property = 'TeamMem'+j;
  //     if(form[i].hasOwnProperty(property)){
  //       if(form[i][property].toUpperCase().length!=8)
  //         console.log('incorrct rollNumber', form[i][property].toUpperCase());
  //       else{
  //         if(array.indexOf(form[i][property].toUpperCase())+1){}
  //         else
  //           array.push(form[i][property].toUpperCase())
  //       }
  //     }
  //   }
  // }
  // console.log(array)
  // return res.send(200)
  var i = req.params.i;
  var house = {
    name: form[i].House_Name,
    team: [{ member: form[i].commanderRoll.toUpperCase() }],
    totalScore: 0,
    commander: form[i].commanderRoll.toUpperCase(),
    commanderPh: form[i].commanderPh
  };
  for (var j = 0; j < 10; ++j) {
    var property = 'TeamMem' + j;
    if (form[i].hasOwnProperty(property)) house.team.push({ member: form[i][property].toUpperCase() });
  }

  _house2.default.create(house).then(respondWithResult(res)).catch(handleError(res));
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
  if (!_validator2.default.isMongoId(req.params.id + '')) return res.status(400).send("Invalid Id");

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
  "Timestamp": "9/20/2016 11:11:03",
  "House_Name": "Wight Walkers",
  "commanderName": "Vinyl Kiran",
  "commanderRoll": "Me14B122",
  "commanderPh": "9176283609",
  "TeamMem1": "Me14B128",
  "TeamMem2": "ME14B129",
  "TeamMem3": "ME14B116",
  "TeamMem4": "ME14B114",
  "TeamMem5": "ME14B133",
  "TeamMem6": "ME14B132",
  "TeamMem7": "ME14B131",
  "TeamMem8": "ME14B146",
  "TeamMem9": "ME14B147"
}, {
  "Timestamp": "9/22/2016 0:07:13",
  "House_Name": "Winterfell Gods",
  "commanderName": "Dinesh Raja",
  "commanderRoll": "ME14B019",
  "commanderPh": "9940500554",
  "TeamMem1": "ME14B020",
  "TeamMem2": "ME14B014",
  "TeamMem3": "ME14B013",
  "TeamMem4": "ME14B018",
  "TeamMem5": "ME14B004",
  "TeamMem6": "ME14B021",
  "TeamMem7": "ME14B022",
  "TeamMem8": "ME14B048",
  "TeamMem9": "ME14B050"
}, {
  "Timestamp": "9/22/2016 0:34:59",
  "House_Name": "Untitled ",
  "commanderName": "Saurabh Sinha",
  "commanderRoll": "ME16B072",
  "commanderPh": "9894523510",
  "TeamMem1": "ME16B060",
  "TeamMem2": "ME16B071",
  "TeamMem3": "ME16B059",
  "TeamMem4": "ME16B057",
  "TeamMem5": "ME16B068",
  "TeamMem6": "ME16B074",
  "TeamMem7": "ME16B067",
  "TeamMem8": "ME16B065",
  "TeamMem9": "ME16B063"
}, {
  "Timestamp": "9/22/2016 12:18:18",
  "House_Name": "ÇHÂÕS",
  "commanderName": "Karnik Sanidhya",
  "commanderRoll": "ME16B017",
  "commanderPh": "9500199780",
  "TeamMem1": "ME16B001",
  "TeamMem2": "ME16B038",
  "TeamMem3": "ME16B011",
  "TeamMem4": "ME16B104",
  "TeamMem5": "ME16B020",
  "TeamMem6": "ME16B018",
  "TeamMem7": "ME16B013",
  "TeamMem8": "ME16B015",
  "TeamMem9": "ME16B019"
}, {
  "Timestamp": "9/22/2016 14:04:07",
  "House_Name": "Pandavas 2.0",
  "commanderName": "M Sai Nithin Reddy",
  "commanderRoll": "ME12B109",
  "commanderPh": "8754512453",
  "TeamMem1": "ME12B106",
  "TeamMem2": "ME12B107",
  "TeamMem3": "ME12B110",
  "TeamMem4": "ME12B062",
  "TeamMem5": "ME12B113",
  "TeamMem6": "ME12B099",
  "TeamMem7": "ED12B034",
  "TeamMem8": "ED12B032",
  "TeamMem9": "ME12B081"
}, {
  "Timestamp": "9/22/2016 14:04:55",
  "House_Name": "Pista's ",
  "commanderName": "Sai Sree Harsha ",
  "commanderRoll": "Me16b066",
  "commanderPh": "9515456459",
  "TeamMem1": "Me16b042",
  "TeamMem2": "Me16b010",
  "TeamMem3": "Me16b009",
  "TeamMem4": "Me16b058",
  "TeamMem5": "Me16b026",
  "TeamMem6": "Me16b007",
  "TeamMem7": "Me16b008",
  "TeamMem8": "Me16b035",
  "TeamMem9": "Me16b064"
}, {
  "Timestamp": "9/22/2016 17:49:42",
  "House_Name": "Direwolves",
  "commanderName": "Siddartha Tadepalli",
  "commanderRoll": "me16b048",
  "commanderPh": "9493895944",
  "TeamMem1": "me16b049",
  "TeamMem2": "me16b034",
  "TeamMem3": "me16b033",
  "TeamMem4": "me16b061",
  "TeamMem5": "me16b029",
  "TeamMem6": "me16b022",
  "TeamMem7": "me16b021"
}, {
  "Timestamp": "9/22/2016 23:32:42",
  "House_Name": "Screws loose",
  "commanderName": "Maneesh",
  "commanderRoll": "ME16B118",
  "commanderPh": "8500569942",
  "TeamMem1": "ME16B113",
  "TeamMem2": "ME16B115",
  "TeamMem3": "ME16B116",
  "TeamMem4": "ME16B122",
  "TeamMem5": "ME16B137",
  "TeamMem6": "ME16B160",
  "TeamMem7": "ME16B157",
  "TeamMem8": "ME16B171",
  "TeamMem9": "ME16B136"
}, {
  "Timestamp": "9/23/2016 0:31:39",
  "House_Name": "GOLDEN SNIPER",
  "commanderName": "V. Lakshmi Narashiman",
  "commanderRoll": "ME16B169",
  "commanderPh": "7397228133",
  "TeamMem1": "ME16B032",
  "TeamMem2": "ME16B037",
  "TeamMem3": "ME16B030",
  "TeamMem4": "ME16B039",
  "TeamMem5": "ME16b040",
  "TeamMem6": "ME16B149",
  "TeamMem7": "ME16B109",
  "TeamMem8": "ME16B014",
  "TeamMem9": "ME16B120"
}, {
  "Timestamp": "9/23/2016 13:36:07",
  "House_Name": "MOTHACUPPERS",
  "commanderName": "Sanjeev Parameswaran",
  "commanderRoll": "Me16b070",
  "commanderPh": "9940336837",
  "TeamMem1": "Me16b075",
  "TeamMem2": "Me16b051",
  "TeamMem3": "Me16b050",
  "TeamMem4": "Me16b002",
  "TeamMem5": "Me16b004",
  "TeamMem6": "Me16b005",
  "TeamMem7": "Me16b023",
  "TeamMem8": "Me16b044"
}, {
  "Timestamp": "9/23/2016 14:20:26",
  "House_Name": "Suicide Squad",
  "commanderName": "Arnav",
  "commanderRoll": "ME14B078",
  "commanderPh": "9790468993",
  "TeamMem1": "ME14B100",
  "TeamMem2": "ME14B077",
  "TeamMem3": "ME14B076",
  "TeamMem4": "ME14B083",
  "TeamMem5": "ME14B080",
  "TeamMem6": "ME14B096",
  "TeamMem7": "ME14B081",
  "TeamMem8": "ME13B066",
  "TeamMem9": "ME14B120",
  "undefined": "8109271996"
}, {
  "Timestamp": "9/23/2016 15:14:57",
  "House_Name": "Pandavas 2.0",
  "commanderName": "M Sai Nithin Reddy",
  "commanderRoll": "ME12B109",
  "commanderPh": "8754512453",
  "TeamMem1": "ME12B113",
  "TeamMem2": "ME12B106",
  "TeamMem3": "ME12B110",
  "TeamMem4": "ME12B107",
  "TeamMem5": "ME12B081",
  "TeamMem6": "ME12B062",
  "TeamMem7": "ME12B099",
  "TeamMem8": "ED12B034",
  "TeamMem9": "ED12B032"
}, {
  "Timestamp": "9/23/2016 17:02:28",
  "House_Name": "Mechanical2016",
  "commanderName": "Pranav Gadikar",
  "commanderRoll": "ME16B107",
  "commanderPh": "9545170490",
  "TeamMem1": "ME16B112",
  "TeamMem2": "ME16B144",
  "TeamMem3": "ME16B148",
  "TeamMem4": "ME16B160",
  "TeamMem5": "ME16B140"
}, {
  "Timestamp": "9/23/2016 17:46:45",
  "House_Name": "Breaking Bad",
  "commanderName": "Vishnu Selvam",
  "commanderRoll": "ME16B016",
  "commanderPh": "9094930955",
  "TeamMem1": "ME16B003",
  "TeamMem2": "ME16B036",
  "TeamMem3": "ME16B031",
  "TeamMem4": "ME16B159",
  "TeamMem5": "ME16B143",
  "TeamMem6": "ME16B124",
  "TeamMem7": "ME16B024",
  "TeamMem8": "ME16B046",
  "TeamMem9": "ME16B047"
}, {
  "Timestamp": "9/23/2016 19:14:24",
  "House_Name": "TEAM ROCKET",
  "commanderName": "GUNJAN MUDGAL",
  "commanderRoll": "ME16B141",
  "commanderPh": "8769247505",
  "TeamMem1": "ME16B147",
  "TeamMem2": "ME16B138",
  "TeamMem3": "ME16B117",
  "TeamMem4": "ME16B146",
  "TeamMem5": "ME16B161",
  "TeamMem6": "ME16B167",
  "TeamMem7": "ME16B168",
  "TeamMem8": "ME16B152",
  "TeamMem9": "ME16B153"
}, {
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
  "Timestamp": "9/23/2016 19:21:53",
  "House_Name": "Gryffindor",
  "commanderName": "Vidyadhar M",
  "commanderRoll": "ME12B092",
  "commanderPh": "9952044531",
  "TeamMem1": "ME12B163",
  "TeamMem2": "ME12B086",
  "TeamMem3": "ME12B011",
  "TeamMem4": "ME12B030",
  "TeamMem5": "ME12B090",
  "TeamMem6": "ME14B106",
  "TeamMem7": "ME14B094",
  "TeamMem8": "ME12B088",
  "TeamMem9": "ME12B016"
}, {
  "Timestamp": "9/23/2016 22:20:48",
  "House_Name": "PROTOTYPE",
  "commanderName": "C SRINIVAS ABHILASH",
  "commanderRoll": "ME16B052",
  "commanderPh": "9442135041",
  "TeamMem1": "ME16B028",
  "TeamMem2": "ME16B053",
  "TeamMem3": "ME16B054",
  "TeamMem4": "ME16B055",
  "TeamMem5": "ME16B056",
  "TeamMem6": "ME16B125",
  "TeamMem7": "ME16B127",
  "TeamMem8": "ME16B045",
  "TeamMem9": "ME16B069"
}, {
  "Timestamp": "9/23/2016 23:54:00",
  "House_Name": "Odysseyus",
  "commanderName": "Anagh soman",
  "commanderRoll": "Me16b133",
  "commanderPh": "9995277115",
  "TeamMem1": "Me16b134",
  "TeamMem2": "Me16b132",
  "TeamMem3": "Me16b135",
  "TeamMem4": "Me16b103",
  "TeamMem5": "Me16b129",
  "TeamMem6": "Me16b139",
  "TeamMem7": "Me16b111",
  "TeamMem8": "Me16b102",
  "TeamMem9": "Me16b119"
}, {
  "Timestamp": "9/24/2016 2:21:43",
  "House_Name": "Dream Chasers",
  "commanderName": "Karthik Bonda",
  "commanderRoll": "ME16B062",
  "commanderPh": "8500827606",
  "TeamMem1": "ME16B105",
  "TeamMem2": "ME16B106",
  "TeamMem3": "ME16B108",
  "TeamMem4": "ME16B155",
  "TeamMem5": "ME16B110"
}, {
  "Timestamp": "9/24/2016 3:33:52",
  "House_Name": "B3",
  "commanderName": "Jai Krishna",
  "commanderRoll": "ME14B029",
  "commanderPh": "9003932043",
  "TeamMem1": "ME14B055",
  "TeamMem2": "ME14B044",
  "TeamMem3": "ME14B038",
  "TeamMem4": "ME14B032",
  "TeamMem5": "ME14B047",
  "TeamMem6": "ME14B046",
  "TeamMem7": "ME14B011",
  "TeamMem8": "ME14B006",
  "TeamMem9": "ME14B152"
}, {
  "Timestamp": "9/25/2016 9:30:43",
  "House_Name": "Creativity Crew",
  "commanderName": "Radha Krishna Jalamanchili",
  "commanderRoll": "ME15B106",
  "commanderPh": "9940123308",
  "TeamMem1": "ME15B107",
  "TeamMem2": "ME15B091",
  "TeamMem3": "ME15B163",
  "TeamMem4": "ME15B134",
  "TeamMem5": "ME15B105"
}, {
  "Timestamp": "9/24/2016 12:12:43",
  "House_Name": "MECHANICAL UNITED",
  "commanderName": "VAMSI KRISHNA",
  "commanderRoll": "ME13B046",
  "commanderPh": "9884183480",
  "TeamMem1": "ME13B003",
  "TeamMem2": "ME13B004",
  "TeamMem3": "ME13B012",
  "TeamMem4": "ME13B014",
  "TeamMem5": "ME13B031",
  "TeamMem6": "ME13B034",
  "TeamMem7": "ME13B038",
  "TeamMem8": "ME13B041",
  "TeamMem9": "ME13B051"
}, {
  "Timestamp": "9/24/2016 12:18:21",
  "House_Name": "MegaMechies",
  "commanderName": "Akshay Dewalwar",
  "commanderRoll": "Me15b080 ",
  "commanderPh": "9962740490",
  "TeamMem1": "Me15b081",
  "TeamMem2": "Me15b044",
  "TeamMem3": "Me15b079",
  "TeamMem4": "Me15b071",
  "TeamMem5": "Me15b085",
  "TeamMem6": "Me15b086",
  "TeamMem7": "Me15b104",
  "TeamMem8": "Me15b109",
  "TeamMem9": "Me15b112"
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
  "Timestamp": "9/24/2016 15:11:33",
  "House_Name": "Chutiyapa Unlimited ",
  "commanderName": "Abinaya Ankur Raut",
  "commanderRoll": "ME15B002",
  "commanderPh": "99401 19536",
  "TeamMem1": "ME15B020",
  "TeamMem2": "ME15B031",
  "TeamMem3": "ME15B032",
  "TeamMem4": "ME15B033",
  "TeamMem5": "ME15B062",
  "TeamMem6": "ME15B066"
}, {
  "Timestamp": "9/24/2016 16:22:01",
  "House_Name": "McManiacs",
  "commanderName": "Vinit Mehta",
  "commanderRoll": "me15b147",
  "commanderPh": "9940108255",
  "TeamMem1": "me15b146",
  "TeamMem2": "me15b145",
  "TeamMem3": "me15b144",
  "TeamMem4": "me15b140",
  "TeamMem5": "me15b139",
  "TeamMem6": "me15b132",
  "TeamMem7": "me15b133",
  "TeamMem8": "me15b130"
}, {
  "Timestamp": "9/24/2016 16:22:06",
  "House_Name": "McManiacs",
  "commanderName": "Vinit Mehta",
  "commanderRoll": "me15b147",
  "commanderPh": "9940108255",
  "TeamMem1": "me15b146",
  "TeamMem2": "me15b145",
  "TeamMem3": "me15b144",
  "TeamMem4": "me15b140",
  "TeamMem5": "me15b139",
  "TeamMem6": "me15b132",
  "TeamMem7": "me15b133",
  "TeamMem8": "me15b130"
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
}, {
  "Timestamp": "9",
  "House_Name": "Mechanical2016",
  "commanderName": "Pranav Gadikar",
  "commanderRoll": "ME16B107",
  "commanderPh": "9884964696",
  "TeamMem1": "ME16B112",
  "TeamMem2": "ME16B144",
  "TeamMem3": "ME16B148",
  "TeamMem4": "ME16B140",
  "TeamMem5": "ME16B164",
  "TeamMem6": "ME16B160",
  "TeamMem7": "ME16B121",
  "TeamMem8": "ME16B163"
}];
//# sourceMappingURL=house.controller.js.map

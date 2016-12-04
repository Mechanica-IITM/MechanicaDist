/**
 * House model events
 */

'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _events = require('events');

var _house = require('./house.model');

var _house2 = _interopRequireDefault(_house);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var HouseEvents = new _events.EventEmitter();

// Set max event listeners (0 == unlimited)
HouseEvents.setMaxListeners(0);

// Model events
var events = {
  save: 'save',
  remove: 'remove'
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  _house2.default.schema.post(e, emitEvent(event));
}

function emitEvent(event) {
  return function (doc) {
    HouseEvents.emit(event + ':' + doc._id, doc);
    HouseEvents.emit(event, doc);
  };
}

exports.default = HouseEvents;
//# sourceMappingURL=house.events.js.map

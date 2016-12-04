/**
 * MeaEvent model events
 */

'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _events = require('events');

var _meaEvent = require('./meaEvent.model');

var _meaEvent2 = _interopRequireDefault(_meaEvent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var MeaEventEvents = new _events.EventEmitter();

// Set max event listeners (0 == unlimited)
MeaEventEvents.setMaxListeners(0);

// Model events
var events = {
  save: 'save',
  remove: 'remove'
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  _meaEvent2.default.schema.post(e, emitEvent(event));
}

function emitEvent(event) {
  return function (doc) {
    MeaEventEvents.emit(event + ':' + doc._id, doc);
    MeaEventEvents.emit(event, doc);
  };
}

exports.default = MeaEventEvents;
//# sourceMappingURL=meaEvent.events.js.map

/**
 * EventCategory model events
 */

'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _events = require('events');

var _eventCategory = require('./eventCategory.model');

var _eventCategory2 = _interopRequireDefault(_eventCategory);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var EventCategoryEvents = new _events.EventEmitter();

// Set max event listeners (0 == unlimited)
EventCategoryEvents.setMaxListeners(0);

// Model events
var events = {
  save: 'save',
  remove: 'remove'
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  _eventCategory2.default.schema.post(e, emitEvent(event));
}

function emitEvent(event) {
  return function (doc) {
    EventCategoryEvents.emit(event + ':' + doc._id, doc);
    EventCategoryEvents.emit(event, doc);
  };
}

exports.default = EventCategoryEvents;
//# sourceMappingURL=eventCategory.events.js.map

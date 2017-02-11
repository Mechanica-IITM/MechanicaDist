'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var EventSchema = new _mongoose2.default.Schema({
  name: String,
  info: { type: String, default: '' },
  startTime: Date,
  endTime: Date,
  date: Date,
  awards: { type: String, default: '' },
  faq: { type: String, default: '' },
  rules: { type: String, default: '' },
  venue: { type: String, default: '' },
  poster: { type: String, default: '' },
  problemStatement: { type: String, default: '' },
  paylink: { type: String, default: '' },
  contact: { type: String, default: '' },
  active: Boolean,
  eventCategory: { type: _mongoose2.default.Schema.Types.ObjectId, ref: 'EventCategory' },
  registered: [{ user: { type: _mongoose2.default.Schema.Types.ObjectId, ref: 'User' } }]
});

exports.default = _mongoose2.default.model('Event', EventSchema);
//# sourceMappingURL=event.model.js.map

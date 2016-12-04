'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var MeaEventSchema = new _mongoose2.default.Schema({
  name: String,
  info: String,
  location: String,
  users: [{ user: { type: _mongoose.Schema.Types.ObjectId, ref: 'User' }, score: Number }],
  date: Date
});

exports.default = _mongoose2.default.model('MeaEvent', MeaEventSchema);
//# sourceMappingURL=meaEvent.model.js.map

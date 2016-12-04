'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Schema = _mongoose2.default.Schema;
var HouseSchema = new _mongoose2.default.Schema({
  name: String,
  team: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  commander: { type: Schema.Types.ObjectId, ref: 'User' },
  meaEvents: [{ user: { type: Schema.Types.ObjectId, ref: 'User' }, meaEvent: { type: Schema.Types.ObjectId, ref: 'MeaEvent' }, score: { type: Number, default: 0 } }]
});

exports.default = _mongoose2.default.model('House', HouseSchema);
//# sourceMappingURL=house.model.js.map

/**
 * Main application routes
 */

'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (app) {
  // Insert routes below
  app.use('/api/events', require('./api/event'));
  app.use('/api/eventCategorys', require('./api/eventCategory'));
  app.use('/api/houses', require('./api/house'));
  app.use('/api/meaEvents', require('./api/meaEvent'));
  app.use('/api/users', require('./api/user'));

  app.use('/auth', require('./auth').default);

  // All undefined asset or api routes should return a 404
  app.route('/:url(api|auth|components|app|bower_components|assets)/*').get(_errors2.default[404]);

  // Send excel file
  app.route('/excel/*').get(function (req, res) {
    global.appRoot = _path2.default.join(_path2.default.resolve(__dirname), '..');
    var file = req.url.split('excel/')[1];
    console.log('dfgh', file);
    res.sendFile(_path2.default.resolve(appRoot + '/' + file));
  });
  // All other routes should redirect to the index.html
  app.route('/*').get(function (req, res) {
    global.appRoot = _path2.default.join(_path2.default.resolve(__dirname), '..');
    res.sendFile(_path2.default.resolve(app.get('appPath') + '/index.html'));
  });
};

var _errors = require('./components/errors');

var _errors2 = _interopRequireDefault(_errors);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
//# sourceMappingURL=routes.js.map

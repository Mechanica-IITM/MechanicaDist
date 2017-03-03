'use strict';
/*eslint no-process-env:0*/

// Development specific configuration
// ==================================

module.exports = {

  // MongoDB connection options
  mongo: {
    uri: process.env.MONGODB_ADDON_URI
    //'mongodb://localhost/mechanica-dev'
  },

  // Seed database on startup
  seedDB: true

};
//# sourceMappingURL=development.js.map

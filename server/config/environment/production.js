'use strict';
/*eslint no-process-env:0*/

// Production specific configuration
// =================================

module.exports = {
  // Server IP
  ip: process.env.OPENSHIFT_NODEJS_IP || process.env.ip || undefined,

  // Server port
  port: process.env.OPENSHIFT_NODEJS_PORT || process.env.port || 8080,

  // MongoDB connection options
  mongo: {
    uri: process.env.MONGODB_ADDON_URI
    // || process.env.MONGOHQ_URL
    // || process.env.OPENSHIFT_MONGODB_DB_URL + process.env.OPENSHIFT_APP_NAME
    // || 'mongodb://ujwya9grzs9jp5t:5uiZZ97lP8503WP0L29C@bysmh4wewm9h6qg-mongodb.services.clever-cloud.com:27017/bysmh4wewm9h6qg'
  }
};
//# sourceMappingURL=production.js.map

"use strict";
module.exports = function(app) {
    var publicResourcesRoutes = require('./publicResourcesRouter.js');
    return publicResourcesRoutes()
        .then(function(router){
            app.use('/', router);
            return;
        });
};

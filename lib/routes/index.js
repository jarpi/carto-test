"use strict";
module.exports = app => {
    var publicResourcesRoutes = require('./publicResourcesRouter.js');
    return publicResourcesRoutes()
        .then((router) => {
            app.use('/', router);
            return;
        });
};

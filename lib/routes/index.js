"use strict";
module.exports = app => {
    const publicResourcesRoutes = require('./publicResourcesRouter.js');
    return publicResourcesRoutes()
        .then((router) => {
            app.use('/', router);

            app.use('/*', (req, res, next) => {
                next({statusCode: 400, msg: 'Invalid route'});
            });

            app.use((err, req, res, next) => {
                console.dir(err);
                const responseError = err.msg || err;
                const statusCode = err.statusCode || 500;
                return res.status(statusCode).end(JSON.stringify({error: responseError}));
            });
            return;
        });
};

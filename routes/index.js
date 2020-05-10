const { Router } = require('express');
const fs = require('fs');
const pathModule = require('path');

const indexRouter = Router();
const apiRouter = Router();

const makeRouter = (routes) => {
  if (!routes || routes.constructor !== Array) {
    throw new Error('routes must be an array type'); // modify message
  }

  const router = Router();

  for (let i = 0; i < routes.length; i += 1) {
    const route = routes[i];
    const {
      method, path, middleware, validators,
    } = route;
    const resolvedMiddleware = [];

    if (validators) {
      resolvedMiddleware.push(validators);
    }

    resolvedMiddleware.push(middleware);
    router[method](path, resolvedMiddleware);
  }

  return router;
};


fs.readdir(__dirname, (err, files) => {
  if (err) {
    throw new Error('Error in reading the current directory');
  }

  for (let i = 0; i < files.length; i += 1) {
    const file = files[i];

    // eslint-disable-next-line
    if (file === 'index.js') continue;

    // eslint-disable-next-line
    const { routes, path, middleware } = require(pathModule.resolve(__dirname, file));
    const router = makeRouter(routes);
    const resolvedMiddleware = [];

    if (routes.path) {
      resolvedMiddleware.push(path);
    }

    if (middleware) {
      resolvedMiddleware.push(middleware);
    }

    resolvedMiddleware.push(router);
    apiRouter.use(path, resolvedMiddleware);
  }
});

indexRouter.use('/api', apiRouter);

module.exports = indexRouter;

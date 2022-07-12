const Router = require("express").Router;
const apiRouter = new Router();

const githubRouter = require("./github");
const keyRouter = require("./apikey");
const githubMiddleWare = require("../middleware/github");

apiRouter.use('/github', githubMiddleWare, githubRouter);
apiRouter.use('/apikey', keyRouter);

module.exports = apiRouter;
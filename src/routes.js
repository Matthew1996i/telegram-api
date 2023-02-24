const express = require('express');

const {
  rootRouter,
  userRouter,
  authRouter,
} = require('./routers');

const routes = express.Router();

routes.use(express.urlencoded({ extended: true }));
routes.use(express.json());

routes.use('/', rootRouter);
routes.use('/user', userRouter);

routes.use('/auth', authRouter)

module.exports = routes;

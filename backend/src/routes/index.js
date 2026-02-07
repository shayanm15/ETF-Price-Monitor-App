const express = require('express');
const config = require('../config');
const privateRouter = express.Router();

const router = express.Router();

privateRouter.use('/file', require('./file.route'));

router.use(`${config.api_route}`, privateRouter);

module.exports = router;
const express = require('express');
const asyncHandler = require('../middlewares/asyncHandler.middleware');
const { getDocumentation } = require('../controllers/docs.controller');

const router = express.Router();

router.get('/', asyncHandler(getDocumentation));

module.exports = router;

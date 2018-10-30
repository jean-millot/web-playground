var express = require('express')
var router = express.Router();

router.use('/', require('./site'));

module.exports = router;

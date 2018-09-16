var express = require('express');
var router = express.Router();

router.get('/browse', (req, res) => {
    res.render('browse' , {});
})

module.exports = router;

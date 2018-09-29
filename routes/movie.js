const express = require('express');
const router = express.Router();
const {apiKey} = require('../config/settings');

router.get('/browse', (req, res) => {
    res.render('browse' , { title : 'MovieDB'});
})

module.exports = router;

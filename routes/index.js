var express = require('express');
var router = express.Router();
const { ensureAuthenticated } = require('../config/auth')

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});

router.get('/welcome', ensureAuthenticated, (req, res) => {
    res.render('welcome', {
        user: req.user
    });
})

module.exports = router;
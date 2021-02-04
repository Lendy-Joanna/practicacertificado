const express = require('express');
const router = express.Router();

//Página de Login
router.get('/', (req, res) => {
        res.render('welcome');
    })
    //Página de registro
router.get('/registro', (req, res) => {
    res.render('registro');
})

module.exports = router;
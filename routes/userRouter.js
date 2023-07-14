const path = require('path');
const express = require('express');
const router = express.Router();
const { register, login, logout, resetPassword } = require(path.join(__dirname, '..', 'controller', 'userController'));

router.get('/register', (req, res) => {
    if (req.isAuthenticated()) {
        res.redirect('/');
    }
    res.render('register');
});

router.get('/login', (req, res) => {
    if (req.isAuthenticated()) {
        res.redirect('/');
    }
    res.render('login', { message: ''});
});

router.get('/reset', (req, res) => {
    if (!req.isAuthenticated()) {
        res.redirect('/login');
    }
    res.render('reset', { message: '', email: req.user.email });
});

router.post('/reset', resetPassword);


router.post('/register', register);

router.post('/login', login);

router.get('/logout', logout);




module.exports = router;
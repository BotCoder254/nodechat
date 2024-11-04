const express = require('express');
const router = express.Router();
const passport = require('passport');
const { ensureGuest } = require('../middleware/auth');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

// Login page
router.get('/login', ensureGuest, (req, res) => {
    res.render('auth/login');
});

// Login handle
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/chat',
        failureRedirect: '/auth/login',
        failureFlash: true
    })(req, res, next);
});

// Register route
router.get('/register', (req, res) => {
    res.render('auth/register');
});

router.post('/register', async(req, res) => {
    try {
        const { username, email, password, password2 } = req.body;

        // Validation
        const errors = [];
        if (!username || !email || !password || !password2) {
            errors.push({ msg: 'Please fill in all fields' });
        }
        if (password !== password2) {
            errors.push({ msg: 'Passwords do not match' });
        }
        if (password.length < 6) {
            errors.push({ msg: 'Password should be at least 6 characters' });
        }

        if (errors.length > 0) {
            return res.render('auth/register', { errors, username, email });
        }

        // Check if user exists
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            errors.push({ msg: 'Email is already registered' });
            return res.render('auth/register', { errors, username, email });
        }

        // Create new user
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            username,
            email: email.toLowerCase(),
            password: hashedPassword
        });
        await newUser.save();

        req.flash('success_msg', 'You are now registered and can log in');
        res.redirect('/auth/login');
    } catch (err) {
        console.error(err);
        res.render('auth/register', { errors: [{ msg: 'Server error' }] });
    }
});

// Logout route
router.get('/logout', (req, res) => {
    req.logout((err) => {
        if (err) {
            console.error(err);
            return next(err);
        }
        req.flash('success_msg', 'You are logged out');
        res.redirect('/auth/login');
    });
});

module.exports = router;

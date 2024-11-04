const express = require('express');

const router = express.Router();

const { ensureAuth } = require('../middleware/auth');

const User = require('../models/User');

const upload = require('../middleware/upload');

const bcrypt = require('bcryptjs');

const fs = require('fs').promises;

const path = require('path');



router.get('/', ensureAuth, (req, res) => {

    res.render('profile/index', { user: req.user });

});



router.put('/update', ensureAuth, upload.single('avatar'), async(req, res) => {

    try {

        const { username, email, currentPassword, newPassword } = req.body;

        const user = await User.findById(req.user._id);



        // Verify current password if trying to change password

        if (newPassword) {

            const isMatch = await bcrypt.compare(currentPassword, user.password);

            if (!isMatch) {

                req.flash('error_msg', 'Current password is incorrect');

                return res.redirect('/profile');

            }

        }



        // Update user fields

        const updates = {

            username,

            email

        };



        // Handle password update

        if (newPassword) {

            updates.password = await bcrypt.hash(newPassword, 10);

        }



        // Handle avatar upload

        if (req.file) {

            // Delete old avatar if it's not the default

            if (user.avatar !== 'default-avatar.png') {

                try {

                    await fs.unlink(path.join(__dirname, '../public/uploads/', user.avatar));

                } catch (err) {

                    console.error('Error deleting old avatar:', err);

                }

            }

            updates.avatar = req.file.filename;

        }



        // Update user

        await User.findByIdAndUpdate(req.user._id, updates);



        req.flash('success_msg', 'Profile updated successfully');

        res.redirect('/profile');

    } catch (err) {

        console.error(err);

        req.flash('error_msg', 'Error updating profile');

        res.redirect('/profile');

    }

});

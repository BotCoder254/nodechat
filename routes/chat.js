const express = require('express');
const router = express.Router();
const { ensureAuth } = require('../middleware/auth');
const { checkChatAccess } = require('../middleware/routeGuard');
const Chat = require('../models/Chat');
const Message = require('../models/Message');
const upload = require('../middleware/upload');

router.get('/', ensureAuth, async(req, res) => {
    try {
        const chats = await Chat.find({
                participants: req.user._id
            })
            .populate('participants')
            .populate('lastMessage')
            .sort('-updatedAt');

        res.render('chat/index', { chats });
    } catch (err) {
        console.error(err);
        req.flash('error_msg', 'Error loading chats');
        res.redirect('/');
    }
});

router.get('/:id', ensureAuth, async(req, res) => {
    try {
        const chat = await Chat.findById(req.params.id)
            .populate('participants')
            .populate('admin');

        if (!chat) {
            req.flash('error_msg', 'Chat not found');
            return res.redirect('/chat');
        }

        const messages = await Message.find({ chat: chat._id })
            .populate('sender')
            .sort('createdAt');

        res.render('chat/room', { chat, messages });
    } catch (err) {
        console.error(err);
        req.flash('error_msg', 'Error loading chat room');
        res.redirect('/chat');
    }
});

router.post('/create', ensureAuth, async(req, res) => {
    try {
        const { type, participants, name } = req.body;

        const newChat = new Chat({
            type,
            participants: [...participants, req.user._id],
            name: type === 'group' ? name : undefined,
            admin: type === 'group' ? req.user._id : undefined
        });

        await newChat.save();
        res.redirect(`/chat/${newChat._id}`);
    } catch (err) {
        console.error(err);
        req.flash('error_msg', 'Error creating chat');
        res.redirect('/chat');
    }
});

router.post('/:id/upload', ensureAuth, upload.single('file'), async(req, res) => {
    try {
        const message = new Message({
            chat: req.params.id,
            sender: req.user._id,
            content: 'Shared a file',
            attachments: [{
                filename: req.file.originalname,
                path: req.file.path,
                mimetype: req.file.mimetype
            }]
        });

        await message.save();
        res.redirect(`/chat/${req.params.id}`);
    } catch (err) {
        console.error(err);
        req.flash('error_msg', 'Error uploading file');
        res.redirect(`/chat/${req.params.id}`);
    }
});

module.exports = router;
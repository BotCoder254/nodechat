const Chat = require('../models/Chat');

module.exports = {
    checkChatAccess: async (req, res, next) => {
        try {
            const chat = await Chat.findById(req.params.id);
            if (!chat) {
                req.flash('error_msg', 'Chat not found');
                return res.redirect('/chat');
            }
            
            if (!chat.participants.includes(req.user._id)) {
                req.flash('error_msg', 'Unauthorized access');
                return res.redirect('/chat');
            }
            
            next();
        } catch (err) {
            console.error(err);
            res.redirect('/chat');
        }
    }
}; 
const express = require('express');

const app = express();

const http = require('http').createServer(app);

const io = require('socket.io')(http);

const path = require('path');

const mongoose = require('mongoose');

const passport = require('passport');

const flash = require('connect-flash');

const session = require('express-session');

const expressLayouts = require('express-ejs-layouts');

const methodOverride = require('method-override');

require('dotenv').config();



// Database connection

mongoose.connect(process.env.MONGODB_URI, {

        useNewUrlParser: true,

        useUnifiedTopology: true

    })

    .then(() => console.log('MongoDB Connected'))

    .catch(err => console.log(err));



// Middleware Setup

app.use(expressLayouts);

app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: false }));

app.use(express.json());

app.use(methodOverride('_method'));

app.use(express.static(path.join(__dirname, 'public')));



// Session Configuration

const sessionMiddleware = session({

    secret: process.env.SESSION_SECRET || 'secret',

    resave: false,

    saveUninitialized: false

});

app.use(sessionMiddleware);



// Passport Configuration

app.use(passport.initialize());

app.use(passport.session());

require('./config/passport')(passport);



// Flash Messages

app.use(flash());



// Global Variables Middleware

app.use((req, res, next) => {

    res.locals.success_msg = req.flash('success_msg');

    res.locals.error_msg = req.flash('error_msg');

    res.locals.error = req.flash('error');

    res.locals.user = req.user || null;

    next();

});



// Routes

const authRouter = require('./routes/auth');

const chatRouter = require('./routes/chat');

const profileRouter = require('./routes/profile');



// API Routes - Place these before error handlers

app.use('/auth', authRouter);

app.use('/chat', chatRouter);

app.use('/profile', profileRouter);



// Landing Page Route

app.get('/', (req, res) => {

    if (req.isAuthenticated()) {

        res.redirect('/chat');

    } else {

        res.render('landing', { layout: false });

    }

});



// Socket.IO Setup

io.on('connection', (socket) => {

    console.log('A user connected');



    socket.on('join', (data) => {

        socket.join(data.room);

    });



    socket.on('chatMessage', (data) => {

        io.to(data.room).emit('message', data);

    });



    socket.on('typing', (data) => {

        socket.to(data.room).emit('userTyping', data.user);

    });



    socket.on('disconnect', () => {

        console.log('User disconnected');

    });

});



// Error Handlers - Must be last

const { errorHandler, notFound } = require('./middleware/errorHandler');



// Handle 404 - Keep this before the errorHandler

app.use((req, res, next) => {

    res.status(404).render('errors/404');

});



// Handle all other errors

app.use((err, req, res, next) => {

    console.error(err.stack);

    res.status(500).render('errors/500', {

        message: process.env.NODE_ENV === 'development' ? err.message : 'Server Error'

    });

});



// Server Startup

const PORT = process.env.PORT || 3000;

http.listen(PORT, () => {

    console.log(`Server running on port ${PORT}`);

});



module.exports = app;

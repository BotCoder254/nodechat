module.exports = {
    mongoURI: process.env.MONGODB_URI,
    sessionSecret: process.env.SESSION_SECRET,
    port: process.env.PORT || 3000,
    env: process.env.NODE_ENV || 'development',
    jwtSecret: process.env.JWT_SECRET
};
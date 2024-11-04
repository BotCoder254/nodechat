module.exports = {
    errorHandler: (err, req, res, next) => {
        console.error(err.stack);
        res.status(500).render('errors/500', {
            message: process.env.NODE_ENV === 'development' ? err.message : 'Server Error'
        });
    },
    
    notFound: (req, res, next) => {
        res.status(404).render('errors/404');
    }
};
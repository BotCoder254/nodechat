const errorHandler = (err, req, res, next) => {
    console.error(err.stack);

    if (err.name === 'ValidationError') {
        return res.status(400).render('errors/400', {
            message: 'Validation Error',
            errors: Object.values(err.errors).map(e => e.message)
        });
    }

    if (err.name === 'CastError') {
        return res.status(400).render('errors/400', {
            message: 'Invalid ID',
            errors: ['The provided ID is invalid']
        });
    }

    res.status(500).render('errors/500', {
        message: 'Server Error',
        error: process.env.NODE_ENV === 'development' ? err : {}
    });
};

module.exports = errorHandler;
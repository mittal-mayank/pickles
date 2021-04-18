require('../src/models');

const mongoose = require('mongoose');

mongoose.connection
    .on('connected', async () => {
        console.log('Database connected');

        global.exceptionHandler = (fn) => (req, res, next) => {
            try {
                fn(req, res, next);
            } catch (err) {
                next(err);
            }
        };
        global.POST_PAGE_LEN = 10;

        const app = require('../src/app');

        const PORT = process.env.PORT || 3000;

        app.listen(PORT, () =>
            console.log(`Server started at http://localhost:${PORT}`)
        );
    })
    .on('disconnect', () => console.log('Database disconnected'))
    .on('error', console.error);

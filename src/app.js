const express = require('express');
const redis = require('redis');
const session = require('express-session');
const RedisStore = require('connect-redis')(session);
const serviceRouter = require('./routers/services');
const apiRouter = require('./routers/api');

const app = express();
const redisClient = redis.createClient();

redisClient.on('error', console.error);

app.set('view engine', 'hbs');
app.set('views', './src/views');

app.use(
    session({
        store: new RedisStore({ client: redisClient }),
        resave: false,
        saveUninitialized: false,
        secret: 'smakpu5UVcMmg51kLTEi',
    })
);
app.use(express.urlencoded({ extended: true }));
app.use('/static', express.static('./src/public'));
app.use('/assets', express.static('./assets'));
app.use('/uploads', express.static('./uploads'));

/*
if routers are added to the middleware stack and then if required path is not found
it automatically moves to next middleware
so order of mounting of routers does not matter unless they both share same path
for user defined middleware functions it is necessary to call next() to move to the next layer or server will be stuck
*/
app.use(serviceRouter);
app.use('/api', apiRouter);

// next must be specified to maintain signature otherwise it will be treated as regualr middleware
app.use((err, req, res, next) => {
    res.sendStatus(500);
    console.error(err);
});

module.exports = app;

// this looks bad, TODO: find alternative
const Koa = require('koa');
const bodyParser = require('koa-body');
const jwt = require('jsonwebtoken');

const router = require('koa-router')();
const render = require('koa-send');
const morgan = require('koa-morgan');

const helmet = require('koa-helmet');
const fs = require('fs');
const path = require('path');

// ensuring files folder exists
process.env.FILES = process.env.FILES || path.join(path.dirname(require.main.filename), 'files');
try {
    fs.mkdirSync(process.env.FILES);
} catch (e) {
    console.log('creating files directory results in erro: ', e.message)
}
// =======================
// configuration =========
// =======================
const app = new Koa();
const config = require('./config');
const db = require('./db')(config.db);
const models = require('./models')(db);
const controllers = require('./controllers')(models, render);
const middlewares = require('./middlewares')(models);
const { combinedRoutes } = require('./routes')({ controllers, middlewares, router });

// =======================
// END configuration =====
// =======================


// =======================
// setting up app ========
// =======================

// cross-origin set up
app.use(middlewares.cors);
// set up security, logging and body
// app.use(helmet);
// app.use(morgan('dev'));
app.use(bodyParser({ multipart: true }));

// middleware to log requests to the console.
app.use(async (ctx, next) => {
    const start = new Date();
    await next();
    const ms = new Date() - start;
    console.log(`Media Server => ${ctx.method} ${ctx.url} - ${ms}ms`);
});

//error handling middleware
app.use(async (ctx, next) => {
    try {
        ctx.type = 'json';
        await next();
    } catch (err) {
        console.log("Media Server error handling", err.message)
        ctx.status = err.status || 500;
        ctx.body = {
            error: err.message
        };
    }
});

// set up app routes
app.use(combinedRoutes);

// creates http server from app, and attach the io (realtime) middleware to app,
const { io, server } = require('./io')(app);

// =======================
// END setting up app ====
// =======================

// =======================
// start the server ======
// =======================
const PORT = 4004;
if (!module.parent) server.listen(PORT, () => console.log(`listening on port ${PORT} on ${process.env.NODE_ENV} enviroment.`));

module.exports = {
    mediaserver: server,
    mediadb: db
};

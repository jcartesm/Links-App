const express = require('express');
const morgan = require('morgan');
const { engine } = require('express-handlebars');
const path = require('path');
const flash = require("connect-flash");
const session = require('express-session');
const MySqlStore = require('express-mysql-session');
const { database } = require('./keys');
const passport = require('passport');

// Inicializar
const app = express();
require('./lib/passport')


// settings
app.set('port',process.env.PORT || 4000);
app.set('views', path.join(__dirname, "views"))
app.engine('.hbs', engine({
    defaultLayout: 'main',
    LayoutsDir: path.join(app.get('views'), 'layouts'),
    PartialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs',
    helpers: require("./lib/handlebars")
}));
app.set('view engine', '.hbs');


// midleweres
app.use(session({
    secret: 'faztmysqlnodesession',
    resave: false,
    saveUninitialized: false,
    store: new MySqlStore(database)
}));
app.use(flash());
app.use(morgan('dev'));
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());

// global variables
app.use((req, res, next) => {
    app.locals.success = req.flash('success');
    app.locals.success = req.flash('message');
    app.locals.user = req.user;
    next();
});

// routes
app.use(require('./routes'));
app.use(require('./routes/authentication'));
app.use('/links',require('./routes/links'));

// Public
app.use(express.static(path.join(__dirname, 'public')));

// starting server
app.listen(app.get('port'), () => (
    console.log('server on port', app.get('port'))
));
const express = require('express');
const mongoose=require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const morgan = require('morgan'); //Logins
const exphbs = require('express-handlebars'); //template engine
const methodOverride = require('method-override');
const passport = require('passport');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const connectDB = require('./config/db');

//Load config 
dotenv.config({path: './config/config.env'});

//passport config
require('./config/passport')(passport);

connectDB();

const app = express();

//Body Parser
app.use(express.urlencoded({extended: false}));
app.use(express.json());

// Method Override
app.use(methodOverride(function (req,res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        //look in urlencoded POST bodies and delete it
        let method = req.body._method;
        delete req.body._method;
        return method;
    }
}))

//Logging
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

//Handlebars helpers
const {formatDate, stripTags, truncate, editIcon, select} = require('./helpers/hbs');

//handlebars
app.engine('.hbs', exphbs.engine({helpers: {
    formatDate,
    stripTags,
    truncate,
    editIcon,
    select
    }, 
    defaultLayout: 'main', 
    extname: '.hbs'
    })
);

app.set('view engine', '.hbs');

//session middleware should be added above the passport middleware
app.use(session({
    secret: 'keyboard cat',
    resave: false, 
    saveUninitialized: false,
     //store session data in mongo
    store: MongoStore.create({ mongoUrl: 'mongodb+srv://hfadel:pit.far.sun-111@hf-cluster.di58a.mongodb.net/storyBooks?retryWrites=true&w=majority'})
}));

//passport middleware
app.use(passport.initialize());
app.use(passport.session());

//Set global variables
app.use(function (req, res, next) {
    res.locals.user = req.user || null;
    next();
})

//Static Folder
app.use(express.static(path.join(__dirname, 'public')));

//Routes
app.use('/auth', require('./routes/auth'));
app.use('/stories', require('./routes/stories'));
app.use('/', require('./routes/index'));

// const PORT = process.env.PORT || 32000;
const PORT = 3200;

app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`));


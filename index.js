const path = require('path');
const express = require('express');
const ejs = require('ejs');
const app = express();
const passport = require('passport');
const session = require('express-session');
const expressEjsLayout = require('express-ejs-layouts')
const port = 3001;

const { db, initPassport, isAuthenticated } = require(path.join(__dirname, 'config', 'main'));

initPassport(passport);
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());

const homeRouter = require(path.join(__dirname, 'routes', 'homeRouter'));
const userRouter = require(path.join(__dirname, 'routes', 'userRouter'));

app.use('/user', userRouter);
app.use(isAuthenticated);
app.use('/', homeRouter);


app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});




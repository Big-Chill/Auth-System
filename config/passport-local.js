const path = require('path');
const bcrypt = require('bcrypt');
const LocalStrategy = require('passport-local').Strategy;
const userModel = require(path.join(__dirname, '..', 'model', 'user'));


const initialize = (passport) => {
    const authenticateUser = async (email, password, done) => {
        try {
            const user = await userModel.findOne({ email: email });
            if (!user) {
                return done(null, false, { message: 'No user with that email' });
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return done(null, false, { message: 'Password incorrect' });
            }

            return done(null, user, { message: 'Logged in successfully' });
        } catch (error) {
            return done(error, false);
        }
    }

    passport.use(new LocalStrategy({ usernameField: 'email' }, authenticateUser));

    passport.serializeUser((user, done) => done(null, user._id));
    passport.deserializeUser(async (id, done) => {
        try {
            const user = await userModel.findById(id);
            return done(null, user);
        } catch (error) {
            return done(error, false);
        }
    });
};

const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }

    return res.redirect('/user/login');
};

module.exports = {
    initPassport: initialize,
    isAuthenticated: isAuthenticated,
}




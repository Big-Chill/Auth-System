const path = require('path');
const bcrypt = require('bcrypt');
const passport = require('passport');
const userModel = require(path.join(__dirname, '..', 'model', 'user'));

// POST /user/register

const register = async (req, res) => {
    const { email, password } = req.body;

    console.log(`Email: ${email}`);
    console.log(`Password: ${password}`)
    try {
        const user = await userModel.findOne({ email: email });

        if (user) {
            res.render('register', { message: 'Email already registered' });
        } else {
            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = new userModel({ email: email, password: hashedPassword });
            await newUser.save();
            res.render('login', { message: 'Please login to continue' });
        }
    } catch (error) {
        console.log(error);
    }
};


// POST /user/login

const login = async (req, res) => {
    if (req.isAuthenticated()) {
        res.redirect('/'); // Redirect to home page if already logged in
    }

    passport.authenticate('local', (err, user, info) => {
        if (err) {
            return res.render('login', { message: err.message });
        }

        if (!user) {
            res.render('login', { message: info.message });
        }

        req.logIn(user, (err) => {
            if (err) {
                return res.render('login', { message: err.message });
            }

            return res.redirect('/');
        });
    })(req, res);
};

// GET /user/logout

const logout = async (req, res) => {
    if (req.isAuthenticated()) {
        req.logout((err) => {
            if (err) {
                return res.render('login', { message: err.message });
            }

            req.session.destroy();

            res.clearCookie('connect.sid');
            return res.redirect('/user/login');
        });
    } else {
        return res.redirect('/user/login');
    }
};

// POST /user/reset-password

const resetPassword = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await userModel.findOne({ email: email });

        if (user) {
            const hashedPassword = await bcrypt.hash(password, 10);
            user.password = hashedPassword;
            await user.save();
            res.render('home');
        } else {
            res.render('reset', { message: 'Email not registered' });
        }
    } catch (error) {
        console.log(error);
    }
};

module.exports = { register, login, logout, resetPassword };
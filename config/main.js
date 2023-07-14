const path = require('path');
const db = require('./mongoose');
const { initPassport, isAuthenticated } = require('./passport-local');




module.exports = {
    db,
    initPassport,
    isAuthenticated,
};


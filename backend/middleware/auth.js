const { v4: uuidv4 } = require('uuid');

// Générer un ID utilisateur unique pour les sessions anonymes
const generateUserId = (req, res, next) => {
    if (!req.headers['user-id']) {
        req.userId = uuidv4();
    } else {
        req.userId = req.headers['user-id'];
    }
    next();
};

module.exports = { generateUserId };
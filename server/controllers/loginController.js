const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../models/db');

const secret = `YSpbpLb-15pwtdS57oduHoEXO--owd25Ac8mMYbfI2M`;

const login = (req, res) => {
    const {username, password} = req.body;

    // check if user exists
    db.query('SELECT * FROM Player WHERE username = ?', [username], (err, results) => {
        if (err) {
            return res.status(500).json({message: 'Database error'});
        }

        if (results.length === 0) {
            return res.status(400).json({message: 'Invalid username or password'});
        }

        const user = results[0];

        // compare password with stored hash
        bcrypt.compare(password, user.password, (err, match) => {
            if (err || !match) {
                return res.status(400).json({message: 'Invalid username or password'});
            }

            // generate jwt token
            const token = jwt.sign({userId: user.idPlayer, username: user.username}, secret, {
                expiresIn: '1hr'
            });

            res.status(200).json({message: 'Login successful', token});
        });
    });
};

module.exports = {login};
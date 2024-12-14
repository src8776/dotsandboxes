const express = require('express');
const bcrypt = require('bcrypt');
const db = require('../models/db');

const router = express.Router();

// registration
router.post('/', (req, res) => {
    const {username, password} = req.body;

    // validate
    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }

    // check if username is taken
    db.query('SELECT * FROM Player WHERE username = ?', [username], (err, results) => {
        if (err) {
            return res.status(500).json({message: 'Database error'});
        }

        if (results.length > 0) {
            return res.status(400).json({message: 'Username is taken'});
        }

        // hash password
        bcrypt.hash(password, 12, (err, hashedPassword) => {
            if (err) {
                return res.status(500).json({message: 'Error hashing password'});
            }

            // insert new user
            const query = 'INSERT INTO Player (username, password, inGame) VALUES (?, ?, 0)';
            db.query(query, [username, hashedPassword], (err, result) => {
                if (err) {
                    return res.status(500).json({message: 'Error registering user'});
                }

                res.status(201).json({message: 'Registered new user'});
            });
        });
    });
});

module.exports = router;
const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password123',
    database: 'DotsAndBoxes'
});

// connect
db.connect((err) => {
    if (err) {
        console.error('Error connection to the database: ', err);
        return;
    }
    console.log('Connected to the database');
});

module.exports = db;
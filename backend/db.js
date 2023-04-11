const {Pool} = require('pg');
const pool = new Pool({
    database: 'messenger',
    user: 'postgres',
    password: 'Gfhjcjkmrf1972',
    host: 'localhost',
    port: '5432'
});


module.exports = pool;
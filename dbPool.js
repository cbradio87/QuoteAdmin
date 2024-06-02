const mysql = require('mysql');

const pool  = mysql.createPool({
    connectionLimit: 10,
    host: "w3epjhex7h2ccjxx.cbetxkdyhwsb.us-east-1.rds.amazonaws.com",
    user: "mf1w8x4ok0oya478",
    password: "d5to7gvvgirxdz4x",
    database: "dmw6rn12umewvz16"
});

module.exports = pool;

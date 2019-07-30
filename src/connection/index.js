const mysql = require('mysql')

const conn = mysql.createConnection(
    {
        user: 'jc9mysqlsubhan',
        password: 'subhan123',
        host: 'db4free.net',
        database: 'jc9mysqlsubhan',
        port : 3306
    }
)

conn.connect(function (err){
    if(err) throw err;
});


module.exports = conn
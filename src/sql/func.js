let mysql = require('mysql');
let db = require('../configs/db');
let pool = mysql.createPool(db);

module.exports = {
    connPool (sql, values) {
        return new Promise(( resolve, reject ) => {
            pool.getConnection( (err, connection) => {
                if (err) {
                    reject( err )
                } else {
                    connection.query(sql, values, ( err, rows) => {
                        if ( err ) {
                            reject( err )
                        } else {
                            resolve( rows )
                        }
                        connection.release()
                    })
                }
            })
        })
    },

    // json格式
    writeJson(res, code = 200, msg = 'ok', data = null) {
        let obj = {code, msg, data};

        if (!data) {
            delete obj.data;
        }

        res.send(obj);
    },
};
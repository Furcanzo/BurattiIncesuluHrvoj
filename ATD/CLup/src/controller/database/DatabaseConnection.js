const mysql = require('mysql')

module.exports = class DatabaseConnection {
    /*static connection = mysql.createPool({
        host     : 'lorenzofratus.it',
        user     : 'clxnnpfi_ferro',
        password : 'ferro98ferro',
        database: 'clxnnpfi_clup'
    })*/
    static connection = mysql.createPool({
        host     : '127.0.0.1',
        user     : 'root',
        password : 'root',
        database: 'CLUP_E2E',
    })
    static getConnection() { return this.connection }
}

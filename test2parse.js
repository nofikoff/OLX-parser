const cheerio = require('cheerio');
const axios = require('axios');
const tedious = require("tedious");
const sql = require('mssql')

const config = {
    user: 'olx',
    password: 'Xxl5124315',
    server: 'flat.pogonyalo.com', 
    database: 'olx',
}


sql.on('error', err => {
    // ... error handler
})

sql.connect(config).then(pool => {
    
    return pool.request()
        .query('select * from test2')
})
.then(result => {
    console.log(result.recordset);
}).catch(err => {
  // ... error checks
});
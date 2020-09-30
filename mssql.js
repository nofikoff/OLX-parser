let async = require('asyncawait/async');
let await = require('asyncawait/await');
//let mysql = require('tedious');
const sql = require('mssql')

async () => {
    try {
        // make sure that any items are correctly URL encoded in the connection string
        await sql.connect('mssql://olx:Xxl5124315@flat.pogonyalo.com/olx')
        const result = await sql.query`select * from test2`
        console.log(result)
    } catch (err) {
        // ... error checks
    }
}



console.log("!!!!!!!");
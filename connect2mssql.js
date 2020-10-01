let async = require('asyncawait/async');
let await = require('asyncawait/await');
//let mysql = require('mysql');
let mssql = require('tedious').Connection;

// кэш соотвествия адреса родителя его ID в БД
let cacheParentUrl2Id = {};


let Connection = require('tedious').Connection;
let config = {
    //server: 'flat.pogonyalo.com',  //update me
    server: 'localhost',
    authentication: {
        type: 'default',
        options: {
            userName: 'olx', //update me
            password: 'Xxl5124315'  //update me

        }
    },
    options: {
        // If you are on Microsoft Azure, you need encryption:
        //encrypt: true,
        database: 'olx'  //update me
    }
};
const connect = new Connection(config);


connect.on('connect', function (err) {
    // If no error, then good to proceed.
    console.log("***********WOW!!!!!! Connected!!!**********");
    executeStatement();
});


var Request = require('tedious').Request;

//var TYPES = require('tedious').TYPES;

function executeStatement() {
    request = new Request("SELECT * FROM test2;", function (err) {
        if (err) {
            console.log(err);
        }
    });
    var result = "";
    request.on('row', function (columns) {
        columns.forEach(function (column) {
            if (column.value === null) {
                console.log('NULL');
            } else {
                result += column.value + " ";
            }
        });
        console.log(result);
        result = "";
    });

    request.on('done', function (rowCount, more) {
        console.log(rowCount + ' rows returned');
    });
    connection.execSql(request);
}

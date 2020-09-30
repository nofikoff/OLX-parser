let async = require('asyncawait/async');
let await = require('asyncawait/await');
let mysql = require('tedious');

// кэш соотвествия адреса родителя его ID в БД
let cacheParentUrl2Id = {};

//https://github.com/tediousjs/tedious
var Connection = require('tedious').Connection;
var Request = require('tedious').Request;
var TYPES = require('tedious').TYPES;

// Create connection to database
var config = {
    server: 'flat.pogonyalo.com',
    authentication: {
        type: 'default',
        options: {
            userName: 'olx', // update me
            password: 'Xxl5124315' // update me
        }
    },
    options: {
        database: 'olx'
    }
}
var connection = new Connection(config);

// Attempt to connect and execute queries if connection goes through
connection.on('connect', function(err) {
    if (err) {
        console.log(err);
    } else {
        console.log('Connected');
    }
});


return;




/*
let con = mysql.createConnection({
    host: "127.0.0.1",
    user: "olx",
    database: 'olx',
    password: "QQji(5$C|!k4"
});
*/


// промис ДБ
const connect = new Promise(resolve =>
    con.connect(function (err) {
        if (err) throw err;
        console.log("Connected!");
        resolve();
    })
);


// промис добавления в БД
let import001 = (vectorAllCategories) => {

    let parent_id = 0;
    let promises_sequences = [];


    console.log("Start Insert");

    //
    // проходим вектор vectorAllCategories в цикле!
    // элемент -  URL, NAME, PARENTURL (дети не нужны)
    // !!!! PARENTURL НЕ определеям динамически из URL опредеить нельзя т.к город подстаялется всегда у родителей тоже
    // определеяем ID родителя по PARENTURL из БД,
    // если PARENTURL === '' то ID родителя времено ставим 0
    // кэшируем справочник PARENTURL <=> ID
    // INSERT URL ID родителя .....
    Object.keys(vectorAllCategories).forEach(
        (urlBranch) => {

            promises_sequences.push(
                () =>
                    /** определим ID Родителя по его адресу **/
                    /** определим ID Родителя по его адресу **/
                    /** определим ID Родителя по его адресу **/
                    new Promise(function (resolve, reject) {

                        console.log("\nВЕТКА", urlBranch)
                        // в кэше есть пара адрес - ID?
                        if (cacheParentUrl2Id[vectorAllCategories[urlBranch].parent] > 0) {
                            parent_id = cacheParentUrl2Id[vectorAllCategories[urlBranch].parent];
                            console.log('ВЫХОДИм родитель из КЭША достали', parent_id)
                            resolve(parent_id);

                            // пытаемся найти в бюазе ID родителя по его URL
                        } else if (vectorAllCategories[urlBranch].parent !== '') {
                            //let sql = "SELECT * FROM `category` WHERE `url` = '"+vectorAllCategories[urlBranch].parent+"'";
                            let sql = "SELECT * FROM `category` WHERE `url` = '" + vectorAllCategories[urlBranch].parent + "'";
                            con.query(sql, function (err, result) {
                                if (err) throw err;
                                if (typeof JSON.parse(JSON.stringify(result))[0] === 'undefined') {
                                    console.log("НЕ ВИЖУ родителя В БД", sql);
                                    parent_id = 0;
                                } else {
                                    console.log(sql, "Result: ", JSON.parse(JSON.stringify(result))[0].id);
                                    cacheParentUrl2Id[vectorAllCategories[urlBranch].parent] = JSON.parse(JSON.stringify(result))[0].id;
                                    //console.log("КЭШ ID родителя по адресу", cacheParentUrl2Id);
                                    parent_id = JSON.parse(JSON.stringify(result))[0].id;
                                }

                                console.log('ВЫХОДИм родитель из БД достали', parent_id)
                                resolve(parent_id);

                            });

                        } else {
                            parent_id = 0;
                            resolve(parent_id);
                        }

                        console.log("\n *** Массив кэша справочника родителей ***", cacheParentUrl2Id)

                    }).then((parent_id) => {
                            console.log("ВТОРОЙ then Родитель найден", parent_id)
                            let sql = "INSERT INTO `category` (`id`, `name`, `url`, `parent`, `date`) VALUES (NULL, '" + vectorAllCategories[urlBranch].name + "', '" + urlBranch + "', '" + parent_id + "', NOW());";
                            con.query(sql, function (err, result) {

                                // if (typeof result.insertId !== "undefined")
                                //     cacheParentUrl2Id[urlBranch] = result.insertId;
                                //  if (err.code !== 'ER_DUP_ENTRY') {
                                // //     // еси найдешь inserted
                                //      cacheParentUrl2Id[urlBranch] = result.insertId;
                                // //
                                //  }
                            });


                            console.log(sql + "\n\n\n")
                        }
                    )
            )
            //КОНЕЦ ЦИКЛА
        });


    (async(function testingAsyncAwait() {
        for (let fn of promises_sequences) {
            await(fn());
        }
    }))();


};

// методы модуля
// методы модуля
let treetodb = {
    save: function (vectorAllCategories) {
        // последовательность промисов
        connect
            .then(() => import001(vectorAllCategories))
            .then(() => {
                // con.destroy();
                // //con.end();
                // console.log("Connection Ended");
            })
        ;
    }
}

module.exports = treetodb




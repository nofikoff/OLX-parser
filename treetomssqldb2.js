let async = require('asyncawait/async');
let await = require('asyncawait/await');
//const tedious = require("tedious");
const sql = require('mssql')

// кэш соотвествия адреса родителя его ID в БД
let cacheParentUrl2Id = {};
let problem_debug_urls_no_parents_db = [];
const config = {
    /*server: 'localhost',
        authentication: {
            type: 'default',
            options: {
                userName: 'olx', //update me
                password: 'Xxl5124315'  //update me
				userName: 'sa', //update me
                password: 'masterkey'  //update me
            }
        },
        options: {
            // If you are on Microsoft Azure, you need encryption:
            //encrypt: true,
			instanceName:'SQLEXPRESS',
			trustedConnection: true,
            database: 'olx'  //update me
        }*/
    user: 'olx',
    password: 'Xxl5124315',
    //password: 'masterkey',
    //server: 'localhost',
    server: 'flat.pogonyalo.com',
    database: 'olx',
}

let our_connection;
// промис ДБ
let treetodb = {
    save: function (vectorAllCategories) {
        // последовательность промисов

        sql.connect(config)
            .then((pool) => {
                our_connection = pool;
            })
            .then(() => import003(vectorAllCategories))

            .then(() => (
                console.log(problem_debug_urls_no_parents_db, "ОТЧЕТ О НЕ СОХЪРАННЕЫХ УЗЛАХ")
            ))


    }
}

// промис добавления в БД
let import002 = () => {

    our_connection.request()
        .query('select * from test2')

        .then(result => {
            console.log(result.recordset);
        })
        .catch(err => {
            // ... error checks
        });

}

let import003 = (vectorAllCategories) => {
    let parent_id = 0;
    let promises_sequences = [];


    //
    // проходим вектор vectorAllCategories в цикле!
    // элемент -  URL, NAME, PARENTURL (дети не нужны)
    // !!!! PARENTURL НЕ определеям динамически из URL опредеить нельзя
    // т.к город подстаялется всегда у родителей тоже
    // определеяем ID родителя по PARENTURL из БД,
    // если PARENTURL === '' то ID родителя времено ставим 0
    // кэшируем справочник PARENTURL <=> ID
    // INSERT URL ID родителя .....

    Object.keys(vectorAllCategories).forEach(
        (url_current_node) => {

            promises_sequences.push(
                () =>
                    /** определим ID Родителя по его адресу **/
                    /** определим ID Родителя по его адресу **/
                    /** определим ID Родителя по его адресу **/
                    new Promise(function (resolve, reject) {

                        console.log("\nВЕТКА", url_current_node)
                        // в кэше есть пара адрес - ID?
                        if (cacheParentUrl2Id[vectorAllCategories[url_current_node].parent] > 0) {
                            parent_id = cacheParentUrl2Id[vectorAllCategories[url_current_node].parent];
                            console.log('ВЫХОДИм родитель из КЭША достали', parent_id)
                            resolve(parent_id);

                            // пытаемся найти в бюазе ID родителя по его URL
                        } else if (vectorAllCategories[url_current_node].parent !== '') {
                            let sql = "SELECT * FROM [olx].[dbo].[category] WHERE Categ_url = '" + vectorAllCategories[url_current_node].parent + "'";

                            //console.log("sql=",sql);

                            our_connection.request()
                                .query(sql, function (err, result) {
                                    //console.log("результат запроса:",result, result.recordset);
                                    if (err) {
                                        console.log('ошибка базы', err)
                                        throw err;
                                    }
                                    //if (typeof JSON.parse(JSON.stringify(result))[0] === 'undefined') {
                                    //console.log("recordset size =  ",result.recordset.length);

                                    //        "recordsets": [[{
                                    //                     "student_firstname": "Jonah                ",
                                    //                     "student_lastname": "Hill                    "
                                    //                 }, {
                                    //                     "student_firstname": "Debra                   ",
                                    //                     "student_lastname": "Smith               "
                                    //                 }
                                    //             ]],
                                    //         "recordset": [{
                                    //                 "student_firstname": "Jonah                ",
                                    //                 "student_lastname": "Hill                    "
                                    //             }, {
                                    //                 "student_firstname": "Debra                   ",
                                    //                 "student_lastname": "Smith               "
                                    //             }
                                    //         ],
                                    //         "output": {},
                                    //         "rowsAffected": [2]
                                    //     }
                                    if (
                                        result.recordset.length == 0
                                    ) {
                                        console.log("НЕ ВИЖУ родителя В БД", sql);
                                        // блокируем текущзйи адрес
                                        parent_id = -1;

                                        // отчет
                                        problem_debug_urls_no_parents_db[url_current_node] =
                                            {
                                                parent: vectorAllCategories[url_current_node].parent,
                                                sql: sql
                                            }

                                    } else {
                                        //console.log(sql, "Result: ", result.recordset[0].ID);
                                        cacheParentUrl2Id[vectorAllCategories[url_current_node].parent] = result.recordset[0].ID;
                                        //console.log("КЭШ ID родителя по адресу", cacheParentUrl2Id);
                                        parent_id = result.recordset[0].ID;
                                    }

                                    console.log('ВЫХОДИм родитель из БД достали', parent_id)
                                    resolve(parent_id);

                                });

                        } else {
                            parent_id = 0;
                            console.log('адрес родителя не задан, присваиваем 0 по дефолту', parent_id)
                            resolve(parent_id);
                        }

                        console.log("\n *** Массив кэша справочника родителей ***", cacheParentUrl2Id)

                    }).then((parent_id) => {

                            // если ID родитедя определен и он не -1
                            if (parent_id !== -1) {
                                console.log("ВТОРОЙ then Родитель определён - сохраняем текущий узел", parent_id)
                                let sql = "INSERT INTO category (Categ_name, Categ_url, Parent, Last_update_data) VALUES ( '" + vectorAllCategories[url_current_node].name + "', '" + url_current_node + "', '" + parent_id + "', GETDATE());";
                                our_connection.request().query(sql, function (err, result) {

                                    // if (typeof result.insertId !== "undefined")
                                    //     cacheParentUrl2Id[url_current_node] = result.insertId;
                                    //  if (err.code !== 'ER_DUP_ENTRY') {
                                    // //     // еси найдешь inserted
                                    //      cacheParentUrl2Id[url_current_node] = result.insertId;
                                    // //
                                    //  }
                                });
                            }


                            console.log(sql + "\n\n\n")
                        }
                    )
            )


        })

    ;


    (async(function testingAsyncAwait() {
        for (let fn of promises_sequences) {
            await(fn());
        }
    }))();


}

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
                            our_connection.query(sql, function (err, result) {
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
                            our_connection.query(sql, function (err, result) {

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


module.exports = treetodb

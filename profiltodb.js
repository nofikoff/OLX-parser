let async = require('asyncawait/async');
let await = require('asyncawait/await');
//const tedious = require("tedious");
const sql = require('mssql')



// сокращения url
//var s = "https://www.olx.ua/obyavlenie/zdatsya-kvartira-IDJhXjN.html#95c827d165";
// var s ="https://www.olx.ua/obyavlenie/kvartira-posutochno-odnokomnatnaya-s-evroremontom-v-tsentre-goroda-IDDr3Q7.html#7c0b3f0da7";
// var withoutLastChunk = s.slice(0, s.lastIndexOf("html"));
//console.log(withoutLastChunk + "html");

//let Prof_url = "https://www.olx.ua/obyavlenie/kvartira-posutochno-odnokomnatnaya-s-evroremontom-v-tsentre-goroda-IDDr3Q7.html";

// кэш соотвествия адреса родителя его ID в БД
let cacheParentUrl2Id = {};

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

server: 'flat.pogonyalo.com',	
    database: 'olx',

}

  /*  const connect = new Connection(config);
    connect.on('connect', function(err) {
        // If no error, then good to proceed.
        console.log("***********WOW!!!!!! Connected!!!**********");
    });*/

let con;
// промис ДБ
let treetodb = {
    save: function (qwerty) {
        // последовательность промисов

        sql.connect(config)
            .then((pool) => {
                con = pool;
            })
            //.then(() => import002(vectorAllCategories))
            .then(() => import003(qwerty))
        //.then(() => import001(vectorAllCategories))


    }
}

// // промис добавления в БД
// let import002 = (vectorAllCategories) => {

// try {
// console.log("hiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii");
//     let sq = "INSERT INTO profiles (Prof_name, Reg_date,  Prof_url, Last_update_data, Prof_status) VALUES ( '" + vectorAllCategories[Prof_url].Prof_name + "', '" + Reg_date +"', '" + Prof_url +  "', GETDATE()" + "', '" + "nul);";
//     console.log("sq = " + sq);


// } catch (error) {
//     console.log("err   " + error);
//     let sql = "SELECT * FROM [olx].[dbo].[profiles] WHERE Prof_url = '" + vectorAllCategories[Prof_url] + "'"; //.patern or ID
							
//     console.log("sql=", sql);
// }
// (async(function testingAsyncAwait() {
//     for (let fn of promises_sequences) {
//         await(fn());
//     }
// }))();
// }

let import003 = (vectorAllCategories) => {
    
   
// Получить ID профйала
// ИНсерт в профйл тэйбл 
// - если успешно - получаем последний инсертед айди бд - учитівая точ телефоні и урл в отдельніх таблицах
// - если не успешно, то такой профайл существует, и мы селект из бд ID єтого профйала




   
    


    console.log("Start Insert", vectorAllCategories);
    //
    // проходим вектор vectorAllCategories в цикле!
    // элемент -  URL, NAME, PARENTURL (дети не нужны)
    // !!!! PARENTURL НЕ определеям динамически из URL опредеить нельзя т.к город подстаялется всегда у родителей тоже
    // определеяем ID родителя по PARENTURL из БД,
    // если PARENTURL === '' то ID родителя времено ставим 0
    // кэшируем справочник PARENTURL <=> ID
    // INSERT URL ID родителя .....
// console.log(vectorAllCategories);
    






            console.log("fun = " +  Prof_url);
 
                    /** определим ID Родителя по его адресу **/
                    /** определим ID Родителя по его адресу **/
                    /** определим ID Родителя по его адресу **/
                    return new Promise(function (resolve, reject) {

                        console.log("\nВЕТКА 1 ", Prof_url)

                            let sql = "INSERT INTO profiles (Prof_name, Reg_date,  Prof_url, Last_update_data, Prof_status) VALUES ( '" + Prof_name + "', '" + Reg_date +"', '" + Prof_url +  "',  GETDATE() , 0)";
                             con.request().query(sql, function (err, result) {
                                
                                 
                                console.log(err , result);

                                if (err) {
                                    let sql = "SELECT ID FROM [olx].[dbo].[profiles] WHERE Prof_url = '" + Prof_url +"'";
                                    console.log("ID = " , sql);        


                                    
                                //  // первый удачный инсерт 
                                //  null { recordsets: [],
                                //     recordset: undefined,
                                //     output: {},
                                //     rowsAffected: [ 1 ] }


                                    con.request()
                                    .query(sql, function (err, result) {
                                                //console.log("результат запроса:",result, result.recordset);
                                        		// if (err) throw err;


                                                url_id = result.recordset[0].ID;
                                                console.log('ВЫХОДИм ID URLa = ', url_id)
                                                return (url_id);                                               
                                                
                
                                            });

                                    
                                }                     

                             });


                             console.log(sql + "\n\n\n")
                        // }
                    // )
                })
              
                    
    

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
        (Prof_url) => {

            promises_sequences.push(
                () =>
                    /** определим ID Родителя по его адресу **/
                    /** определим ID Родителя по его адресу **/
                    /** определим ID Родителя по его адресу **/
                    new Promise(function (resolve, reject) {

                        console.log("\nВЕТКА", Prof_url)
                        // в кэше есть пара адрес - ID?
                        if (cacheParentUrl2Id[vectorAllCategories[Prof_url].parent] > 0) {
                            parent_id = cacheParentUrl2Id[vectorAllCategories[Prof_url].parent];
                            console.log('ВЫХОДИм родитель из КЭША достали', parent_id)
                            resolve(parent_id);

                            // пытаемся найти в бюазе ID родителя по его URL
                        } else if (vectorAllCategories[Prof_url].parent !== '') {
                            //let sql = "SELECT * FROM `category` WHERE `url` = '"+vectorAllCategories[Prof_url].parent+"'";
                            let sql = "SELECT * FROM `category` WHERE `url` = '" + vectorAllCategories[Prof_url].parent + "'";
                            con.query(sql, function (err, result) {
                                if (err) throw err;
                                if (typeof JSON.parse(JSON.stringify(result))[0] === 'undefined') {
                                    console.log("НЕ ВИЖУ родителя В БД", sql);
                                    parent_id = 0;
                                } else {
                                    console.log(sql, "Result: ", JSON.parse(JSON.stringify(result))[0].id);
                                    cacheParentUrl2Id[vectorAllCategories[Prof_url].parent] = JSON.parse(JSON.stringify(result))[0].id;
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
                            let sql = "INSERT INTO `category` (`id`, `name`, `url`, `parent`, `date`) VALUES (NULL, '" + vectorAllCategories[Prof_url].name + "', '" + Prof_url + "', '" + parent_id + "', NOW());";
                            con.query(sql, function (err, result) {

                                // if (typeof result.insertId !== "undefined")
                                //     cacheParentUrl2Id[Prof_url] = result.insertId;
                                //  if (err.code !== 'ER_DUP_ENTRY') {
                                // //     // еси найдешь inserted
                                //      cacheParentUrl2Id[Prof_url] = result.insertId;
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
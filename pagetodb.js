let async = require('asyncawait/async');
let await = require('asyncawait/await');
//let mysql = require('mysql');
const sql = require('mssql');

// кэш соотвествия адреса родителя его ID в БД
let cacheParentUrl2Id = {};
let cacheAdsUrl2Id = {};


/*let con = mysql.createConnection({
    host: "stas.pogonyalo.com",
    user: "olx2",
    database: 'olx',
    password: "y2jC2wBSlfi0YeCP"
});
*/
/*
let con = mysql.createConnection({
    host: "127.0.0.1",
    user: "olx",
    database: 'olx',
    password: "QQji(5$C|!k4"
});
*/

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
let adstodb = {
    save: function (text) {
        // последовательность промисов

        sql.connect(config)
            .then((pool) => {
                our_connection = pool;
            })
            .then(() => import001(text))

            .then(() => (
                console.log("ОТЧЕТ О НЕ СОХЪРАННЕЫХ УЗЛАХ")
            ))


    }
}


// промис добавления в БД
let import001 = (Adsxxx) => {

    let parent_id = 0;
    let promises_sequences = [];

new Promise(function (resolve, reject)  {
    console.log("Start Insert");

   //на входе получаем объект text из парсера page.js

 console.log("Ad_name=",Adsxxx.title); 
 console.log("Adress=",Adsxxx.address); 
 console.log("price=",Adsxxx.price); 
 console.log("Description=",Adsxxx.desc); 
 console.log("images=",Adsxxx.images); 
 console.log("url_category=",Adsxxx.urlCategory); 
 console.log("Ad_number=",Adsxxx.AD_NUMBER); 
 console.log("Ad_creation_data=",Adsxxx.Dat); 
 
 let sql = "SELECT * FROM [olx].[dbo].[category] WHERE Categ_url = '" + Adsxxx.urlCategory + "'";
              our_connection.request()
                                .query(sql, function (err, result) {
                                    //console.log("результат запроса:",result, result.recordset);
                                    if (err) {
                                        console.log('ошибка базы', err)
                                        throw err;
                                    }
                                    if (
                                        result.recordset.length == 0
                                    ) {
                                        console.log("НЕ ВИЖУ такой категории в базе, надо пересканировавть категории", sql);
                                        // блокируем текущзйи адрес
                                        //parent_id = -1;

                                        // отчет
                                        /*problem_debug_urls_no_parents_db[url_current_node] =
                                            {
                                                parent: vectorAllCategories[url_current_node].parent,
                                                sql: sql
                                            }*/

                                    } else {
                                        //console.log(sql, "Result: ", result.recordset[0].ID);
                                        //cacheParentUrl2Id[vectorAllCategories[url_current_node].parent] = result.recordset[0].ID;
                                        //console.log("КЭШ ID родителя по адресу", cacheParentUrl2Id);
                                        categ_id = result.recordset[0].ID;
                                    }

                                    console.log('ВЫХОД ID category из БД достали', categ_id)
                                    resolve(categ_id);
								})
                                }).then((categ_id) => {
                            console.log("ВТОРОЙ then categoryid найден", categ_id)
                            let sql = `INSERT INTO ads (Ad_name, Adress, price, Description, images,Categ_id, Ad_number,Ad_creation_data,Last_update_data,Status,Ad_url_id) VALUES ("${Adsxxx.title}", "${Adsxxx.address}", ${Adsxxx.price}, "${Adsxxx.desc}", "${Adsxxx.images}",${categ_id}, ${Adsxxx.AD_NUMBER}, '${Adsxxx.Dat}',GETDATE(),1,221)`;
							//console.log("sql query text = ",sql);
                            
                            
							our_connection.request()
                                .query(sql, function (err, result) {

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
                    );
 

    (async(function testingAsyncAwait() {
        for (let fn of promises_sequences) {
            await(fn());
        }
    }))();


};

// методы модуля
// методы модуля


module.exports = adstodb




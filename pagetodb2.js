let async = require('asyncawait/async');
let await = require('asyncawait/await');
//let mysql = require('mysql');
const sql = require('mssql');
const matchAll = require('match-all');

// кэш соотвествия адреса родителя его ID в БД
let cacheParentUrl2Id = {};
let cacheAdsUrl2Id = {};



const config = {

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
            .then(($) => import003(text))

            .then(($) => import001(text))

            .then(() => (
                console.log("ОТЧЕТ О НЕ СОХЪРАННЕЫХ УЗЛАХ")
            ))


    }
}


// Profiles


let import003 = (profile) => {


    // Получить ID профйала
    // ИНсерт в профйл тэйбл 
    // - если успешно - получаем последний инсертед айди бд - учитівая точ телефоні и урл в отдельніх таблицах
    // - если не успешно, то такой профайл существует, и мы селект из бд ID єтого профйала








    console.log("Start Insert", profile);
    //
    // проходим вектор profile в цикле!
    // элемент -  URL, NAME, PARENTURL (дети не нужны)
    // !!!! PARENTURL НЕ определеям динамически из URL опредеить нельзя т.к город подстаялется всегда у родителей тоже
    // определеяем ID родителя по PARENTURL из БД,
    // если PARENTURL === '' то ID родителя времено ставим 0
    // кэшируем справочник PARENTURL <=> ID
    // INSERT URL ID родителя .....
    // console.log(profile);







    console.log("fun 2 = " , profile.phone);


    /** определим ID Родителя по его адресу **/
    /** определим ID Родителя по его адресу **/
    /** определим ID Родителя по его адресу **/
    
    return new Promise((resolve) => {

        let profile_id ;
        
        console.log("\nВЕТКА 1 ", Prof_url)

        let sql = "INSERT INTO profiles (Prof_name, Reg_date,  Prof_url, Last_update_data, Prof_status) OUTPUT INSERTED.ID VALUES ( '" + Prof_name + "', '" + Reg_date + "', '" + Prof_url + "',  GETDATE() , 0)";

        return our_connection.request().query(sql, function (err, result) {



            // если успешно сохранен проайл то сохраняем его телефоны  
            if (typeof result !== "undefined" ) {
                //  let x = 0;
                profile_id = result.recordset[0].ID;

                console.log("tut id ", profile_id);
                url_id = profile_id;


                let arei = [];
                matches = matchAll(profile.phone.replace(/\s|\(|\)|-/g, '') , /(0\d{9})/g);
                let r = 0;
                for ( let match of matches.toArray()) 
                {
                    r++;
                    arei[r] = match ;
                   // console.log(match);
                }
                //console.log("werwrew",arei);
                

                    for (let i = 1; i < arei.length; i++) {
                        let sql_phon = "INSERT INTO phones (Phone_num, Scan_date,  Phone_status, Prof_id) VALUES ( '" + arei[i] + "', GETDATE() , 0 ,  " + profile_id + ")";
                        console.log(sql_phon);
                    
                        our_connection.request()
                        .query(sql_phon, function (err, result2) {
                            //console.log(sql_phon);
                            //return(profile_id);



                        });

                    }
                   resolve (url_id);           


            }
            else {
                let sql = "SELECT ID FROM profiles WHERE Prof_url = '" + Prof_url + "'";
                console.log("ID = ", sql);



                //  // первый удачный инсерт 
                //  null { recordsets: [],
                //     recordset: undefined,
                //     output: {},
                //     rowsAffected: [ 1 ] }


                return our_connection.request()
                    .query(sql, function (err, result3) {
                        //console.log("результат запроса:",result, result.recordset);
                        // if (err) throw err;


                        url_id = result3.recordset[0].ID;
                        console.log('ВЫХОДИм ID URLa = ', url_id)
                        resolve (url_id);


                    });


            }
          

        });



    })




}









// ads
// промис добавления в БД
let import001 = (Adsxxx) => {

 console.log('Profil_url_id ',url_id);
    let parent_id = 0;
    let promises_sequences = [];

new Promise(function (resolve, reject)  {
    console.log("Start Insert import001 ", Adsxxx);

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

                                    console.log('ВЫХОД ID category из БД достали', categ_id);
                                    resolve(categ_id);
								})
                                }).then((categ_id) => {
                            console.log("ВТОРОЙ then categoryid найден", categ_id)
                            let sql = `INSERT INTO ads (Prof_ID, Ad_name, Adress, price, Description, images,Categ_id, Ad_number,Ad_creation_data,Last_update_data,Status,Ad_url_id) VALUES ('`+ url_id +`', '${Adsxxx.title}', '${Adsxxx.address}', ${Adsxxx.price}, '${Adsxxx.desc}', '${Adsxxx.images}',${categ_id}, ${Adsxxx.AD_NUMBER}, '${Adsxxx.Dat}',GETDATE(),1,221)`;
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

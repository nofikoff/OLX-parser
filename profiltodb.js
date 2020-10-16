let async = require('asyncawait/async');
let await = require('asyncawait/await');
//const tedious = require("tedious");
const sql = require('mssql')
const matchAll = require('match-all');


// сокращения url
//var s = "https://www.olx.ua/obyavlenie/zdatsya-kvartira-IDJhXjN.html#95c827d165";
// var s ="https://www.olx.ua/obyavlenie/kvartira-posutochno-odnokomnatnaya-s-evroremontom-v-tsentre-goroda-IDDr3Q7.html#7c0b3f0da7";
// var withoutLastChunk = s.slice(0, s.lastIndexOf("html"));
//console.log(withoutLastChunk + "html");

//let Prof_url = "https://www.olx.ua/obyavlenie/kvartira-posutochno-odnokomnatnaya-s-evroremontom-v-tsentre-goroda-IDDr3Q7.html";

// кэш соотвествия адреса родителя его ID в БД
let cacheParentUrl2Id = {};

const config = {

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

        return sql.connect(config)
            .then((pool) => {
                con = pool;
            })
            //.then(() => import002(profile))
            .then(() => import003(qwerty))
        //.then(() => import001(profile))


    }
}



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

        let profile_id;
        console.log("\nВЕТКА 1 ", Prof_url)

        let sql = "INSERT INTO profiles (Prof_name, Reg_date,  Prof_url, Last_update_data, Prof_status) OUTPUT INSERTED.ID VALUES ( '" + Prof_name + "', '" + Reg_date + "', '" + Prof_url + "',  GETDATE() , 0)";

        return con.request().query(sql, function (err, result) {



            // если успешно сохранен проайл то сохраняем его телефоны  
            if (typeof result !== "undefined" ) {
                //  let x = 0;
                profile_id = result.recordset[0].ID;

                console.log("tut id ", profile_id);


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
                  
                     con.request()
                    .query(sql_phon, function (err, result2) {
                        //console.log(sql_phon);
                        //return(profile_id);

                       // resolve (profile_id);

                    });

                  }
                  resolve (profile_id);
                  
 

 

            }



            else {
                let sql = "SELECT ID FROM profiles WHERE Prof_url = '" + Prof_url + "'";
                console.log("ID = ", sql);



                //  // первый удачный инсерт 
                //  null { recordsets: [],
                //     recordset: undefined,
                //     output: {},
                //     rowsAffected: [ 1 ] }


                return con.request()
                    .query(sql, function (err, result3) {
                        //console.log("результат запроса:",result, result.recordset);
                        // if (err) throw err;


                        url_id = result3.recordset[0].ID;
                        console.log('ВЫХОДИм ID URLa = ', url_id)
                        resolve (url_id);


                    });


            }

        });


        console.log(sql + "\n\n\n")
        // }
        // )
    })




}



// методы модуля
// методы модуля


module.exports = treetodb

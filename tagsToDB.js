const sql = require("mssql");
let config = {
    user: "olx",
    password: "Xxl5124315",
    server: "flat.pogonyalo.com",
    database: "olx",
};

sql.on("error", (err) => {
    // ... error handler
});
// основноый вызов
let caller = {
    save: function (hashTags) {
        for (const [key, value] of Object.entries(hashTags)) {
            //console.log(`key = ${key}`);
            let inserToTagGroup =
                "use olx insert into [dbo].[tag_group] values ( '" + key +"' );";
            let selectFromTagGroup = "SELECT [ID] FROM [olx].[dbo].[tag_group] where [Tag_name] = '"+ key +"';";
            //console.log(inserToTagGroup);
            sql.connect(config)
                .then((pool) => {
                    return pool.request().query(inserToTagGroup); //Пишем в базу
                }).catch((err) => {
                console.log(err['message']);
            });
            sql.connect(config)
                .then((pool) => {
                    return pool.request().query(selectFromTagGroup); //Селектим tag_group ID
                    //console.log(selectFromTagGroup);
                })
                .then((result) => {
                    return result.recordset;
                })
                .then((GroupId) =>{
                    //console.log(GroupId[0]['ID']);
                    for (var key2 in value) {
                        //console.log("value: ",value[key2]); //value[key2] - это сам тэг
                        let insertToTags_qwery =
                            "use olx insert into [dbo].[tags] values ( '" + value[key2] +"', GETDATE(), null, " + GroupId[0]['ID'] + ");";
                        console.log(insertToTags_qwery);
                        sql.connect(config)
                            .then((pool) => {
                                return pool.request().query(insertToTags_qwery); //Пишем в базу
                            }).catch((err) => {
                            console.log(err['message']);
                        });
                    }
                }).catch((err) => {
                console.log(err['message']);
                })
            ;
        }
    },
};

module.exports = caller;
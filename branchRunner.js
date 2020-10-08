const branchToDB = require("./branch.js");
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


function selectCategories(){
  return sql.connect(config)
    .then(pool => {
     return pool.request()
      .query('select * from [category]')
    })
    .then(result => result.recordset)
    .catch(err => {
      //console.log(err);
    });
}
 selectCategories().then(
   (categories)=>{
    console.log("Колличество категорий = ", Object.keys(categories).length);
    return categories
    }
 ).then( 
   (categories)=>{
     if(typeof categories!=='undefined'){
        for (let [key, value] of Object.entries(categories)) {
          console.log(value.Categ_url);
          branchToDB.save(value.Categ_url);
      }
    }
  }
 );


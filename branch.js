const cheerio = require("cheerio");
const axios = require("axios");
const sql = require("mssql");
const { result } = require("asyncawait/async");


let config = {
    user: 'olx',
    password: 'Xxl5124315',
    server: 'flat.pogonyalo.com', 
    database: 'olx' 
};

sql.on('error', err => {
  // ... error handler
})


let sqlArrayBrenchs = [];
let pagerMax;
// основноый вызов
getBranchCall(
  "https://www.olx.ua/zapchasti-dlya-transporta/shiny-diski-i-kolesa/zhitomir/"
).then((branch) => {
  
  for (const [key, value] of Object.entries(branch)) {
    console.log(`${key}: ${value}`);
    let inserToUrl_qwery = "use olx insert into urls values (1 ,  GETDATE(), '" + key + "', 2);";
    sql.connect(config)
    .then(pool => {
      return pool.request()
          .query(inserToUrl_qwery) //Пишем в базу
      })
      .then(result => {
          console.log(result.recordset);
      })
      .catch(err => {
          // ... error checks
      });
  }
  
});

async function getBranchCall(url) {
  // нулевой шаг
  return (
    getBranch(url)
      .then((nextPageFlag) => {
        //console.log("First flag", nextPageFlag);
        // 2-25 - максимум бывает только 25

        let promises = [];
        for (let i = 2; i <= pagerMax; i++) {
          //console.log("\n создем промис  " + i);
          promises.push(getBranch(url + "?page=" + i));
          // выходим если ссылки на ads не обнаружены
        }
        return Promise.all(promises);
      })
      // функция асинхронная по  этому здесь дожидаемся наполнение маасива
      //console.log("\nПРОМИЖУТОЧНЫЙ ИТОГ наш ответ ", sqlArrayBrenchs);
      .then(() => {
        //console.log("ПИШЕМ В БД1", sqlArrayBrenchs);
        return sqlArrayBrenchs;
      })
  );
}

function getBranch(url) {
  return axios
    .get(url, {
      // не поддерживаме редирект ловим 301 code и пустую страницу ловим
      maxRedirects: 0,
      headers: {
        authority: "www.olx.ua",
        pragma: "no-cache",
        "cache-control": "no-cache",
        accept: "*/*",
        "user-agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.135 Safari/537.36",
        "x-requested-with": "XMLHttpRequest",
        "sec-fetch-site": "same-origin",
        "sec-fetch-mode": "cors",
        "sec-fetch-dest": "empty",
        // ВАЖНО !!!
        referer: url,
        "accept-language": "en-UA,en;q=0.9,ru-AU;q=0.8,ru;q=0.7,en-US;q=0.6",
      },
    })
    .then((content) => {
      return cheerio.load(
        content.data
          .replace(/[\r\n\t]+/g, " ")
          .replace(/ +(?= )/g, "")
          .trim()
      );
    })
    .catch((error) => {
      console.log("ДАННЫХ НЕТ axios вернул ошибку " + url);
      return "";
    })

    .then(($) => {
      // выходим
      if ($("a.detailsLink").length === 0) throw 0;

      pagerMax = $('a[data-cy="page-link-last"]').first().text().trim();

      $("a.detailsLink").each((idx, elem) => {
        let link = $(elem).attr("href");
        let title = $(elem).find("img").attr("alt");
        //
        link = link.split("html")[0] + "html";
        //console.log(title, link);
        // если не пустой аголовок
        if (typeof title === "string") sqlArrayBrenchs[link] = title;
      });
      // следующая страница пагинации
      return 1;
    })

    .catch((error) => {
      console.log("ВЫХОДИМ ИЗ ЦИКЛА");
      return 0;
    });
}

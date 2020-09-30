const cheerio = require('cheerio');
const axios = require('axios');
const mysql = require('mysql');

const con = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: '',
});
// содеинени для храениня эмоджи
// содеинени для храениня эмоджи
// содеинени для храениня эмоджи
con.query("SET NAMES utf8mb4",
    (err, rows) => {
        if (err) console.log(err.sqlMessage);
    });



let sqlArrayBrenchs = [];
let pagerMax;
// основноый вызов
hello('https://www.olx.ua/moda-i-stil/odezhda/muzhskoe-bele/ivano-frankovsk/')
//hello('https://www.olx.ua/zapchasti-dlya-transporta/shiny-diski-i-kolesa/ivano-frankovsk/')
    .then((xxx) => {
        console.log("ПИШЕМ В БД2", xxx);

        // if (typeof (entry.node.username) === 'string') {
        //
        //     let sql = "INSERT INTO `olx`.`category` (`id`, `insta_user_id`, `insta_full_name`, `insta_profile_pic_url`, `insta_is_private`, `insta_is_verified`, `pisuki_id`, `instafollowersofnickname`, `nickname`, `status`, `created`) VALUES " +
        //         "(NULL, '" + entry.node.id + "', '" + entry.node.full_name.replace(/'/g, "") + "', '" + entry.node.profile_pic_url + "', '" + ((entry.node.is_private === 'true') ? 1 : 0) + "', '" + ((entry.node.is_verified === 'true') ? 1 : 0) + "', NULL, '" + scrap_profile.nickname + "', '" + entry.node.username + "', NULL, '" + dt.format('Y-m-d H:M:S') + "');";
        //
        //     //console.log(entry.node.full_name);
        //     //console.log(sql);
        //
        //     con.query(sql,
        //         (err, rows) => {
        //             if (err) console.log(err.sqlMessage);
        //         });
        // } else {
        //     console.log(entry.node.username, "Попытка пихать в базу какуюто ДИЧЬ!");
        // }



    })

async function hello(url) {

    // нулевой шаг
    return getBranch(url)

        .then(
            (nextPageFlag) => {
                console.log("First flag", nextPageFlag);
                // 2-25 - максимум бывает только 25

                let promises = [];
                for (let i = 2; i <= pagerMax; i++) {
                    console.log("\n создем промис  " + i);
                    promises.push(getBranch(url + '?page=' + i));
                    // выходим если ссылки на ads не обнаружены
                }
                return Promise.all(promises);
            }
        )
        // функция асинхронная по  этому здесь дожидаемся наполнение маасива
        //console.log("\nПРОМИЖУТОЧНЫЙ ИТОГ наш ответ ", sqlArrayBrenchs);
        .then(() => {
            //console.log("ПИШЕМ В БД1", sqlArrayBrenchs);
            return sqlArrayBrenchs;
        })


}


function getBranch(url) {

    return axios.get(url,
        {

            // не поддерживаме редирект ловим 301 code и пустую страницу ловим
            // не поддерживаме редирект ловим 301 code и пустую страницу ловим
            maxRedirects: 0,

            headers: {
                'authority': 'www.olx.ua',
                'pragma': 'no-cache',
                'cache-control': 'no-cache',
                'accept': '*/*',
                'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.135 Safari/537.36',
                'x-requested-with': 'XMLHttpRequest',
                'sec-fetch-site': 'same-origin',
                'sec-fetch-mode': 'cors',
                'sec-fetch-dest': 'empty',
                // ВАЖНО !!!
                'referer': url,
                'accept-language': 'en-UA,en;q=0.9,ru-AU;q=0.8,ru;q=0.7,en-US;q=0.6',
                //'cookie': 'PHPSESSID=psb0hg31nq2ceekba3cunsm847'

            }
        }
    )
        .then(
            (content) => {
                return cheerio.load(
                    content.data
                        .replace(/[\r\n\t]+/g, ' ')
                        .replace(/ +(?= )/g, '')
                        .trim()
                );
            }
        )
        .catch(error => {
            console.log('ДАННЫХ НЕТ axios вернул ошибку ' + url);
            return '';
        })

        .then(($) => {

            // выходим
            if ($('a.detailsLink').length === 0) throw 0;




            pagerMax=$('a[data-cy="page-link-last"]').first().text().trim();


            $('a.detailsLink').each((idx, elem) => {
                let link = $(elem).attr('href');
                let title = $(elem).find('img').attr('alt');
                //
                link = link.split('html')[0] + 'html';
                //console.log(title, link)
                // если не пустой аголовок
                if (typeof title === 'string') sqlArrayBrenchs[link] = title;
            })
            // следующая страница пагинации
            return 1;
        })

        .catch(error => {
            console.log('ВЫХОДИМ ИЗ ЦИКЛА');
            return 0;
        })


}


const cheerio = require('cheerio');
const axios = require('axios');

let sqlArrayTrees = [];
// основноый вызов

getChildren('https://www.olx.ua/transport/legkovye-avtomobili/')
    .then((xxx) => {
        console.log("ПИШЕМ В БД2\n", xxx);
    })

function getChildren(url) {

    return axios.get(url,
        {
            // не поддерживаме редирект ловим 301 code и пустую страницу ловим
            maxRedirects: 0, headers: {
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
    ).then(
        (content) => {
            return cheerio.load(
                content.data
                    .replace(/[\r\n\t]+/g, ' ')
                    .replace(/ +(?= )/g, '')
                    .trim()
            );
        }
    ).catch(_error => {
        console.log('ДАННЫХ НЕТ axios вернул ошибку \n' + url);
        // контент пустой
        return '';
    }).then(($) => {
        sqlArrayTrees[url] = [];
        // выходим - ДЕТЕЙ НЕТ
        if ($('a.topLink').length === 0) throw 0;

        $('div#topLink a.topLink').each((idx, elem) => {
            let link = $(elem).attr('href');
            let title = $(elem).find('span.link').text();
            // если не пустой заголовок
            if (typeof title === 'string') {
                sqlArrayTrees[url][link] = title;
            }
        })
        // следующая страница пагинации
        return 1;
    }).catch(_error => {
        console.log('ВЫХОДИМ ИЗ ЦИКЛА\n');
        return 0;
    }).then(
        (nextPageFlag) => {
            let promises = [];
            console.log(sqlArrayTrees[url]);
            for (let key in sqlArrayTrees[url]) {
                promises.push(getChildren(key));
                // выходим если ссылки на ads не обнаружены
            }
            return Promise.all(promises);
        }
    ).then(() => {
        return sqlArrayTrees;
    })
}

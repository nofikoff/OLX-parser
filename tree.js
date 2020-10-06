const cheerio = require('cheerio');
const axios = require('axios');

let sqlArrayTrees = [];
// основноый вызов

getChildren('https://www.olx.ua/transport/legkovye-avtomobili/')
// .then((xxx) => {
//     console.log("ПИШЕМ В БД2\n", xxx);
// })

function getChildren(url_current_node) {

    return axios.get(url_current_node,
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
                'referer': url_current_node,
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
        console.log('ДАННЫХ НЕТ axios вернул ошибку \n' + url_current_node);
        // контент пустой
        return '';
    }).then(($) => {
        // инициализация - сначала пустой массив -
        // узел сохраняем в вектор обьект, этот обьект позже передается в базу
        sqlArrayTrees[url_current_node] = [];
        // выходим - ДЕТЕЙ НЕТ
        // выходим - ДЕТЕЙ НЕТ
        // выходим - ДЕТЕЙ НЕТ
        if ($('a.topLink').length === 0) {

            console.log("Страницу узла вижу, но детей нет")

        } else {

            $('div#topLink a.topLink').each((idx, elem) => {
                let link = $(elem).attr('href');
                let title = $(elem).find('span.link').text();
                // если не пустой заголовок
                if (typeof title === 'string') {
                    console.log("Найден следующий подувроень ребенок",  title);
                    sqlArrayTrees[url_current_node][link] = title;
                }
            })
        }

    })
    .then(
        () => {
            // еси надо нырнуть глбуже
            // еси надо нырнуть глбуже
            // еси надо нырнуть глбуже
            // еси надо нырнуть глбуже
            if (sqlArrayTrees[url_current_node].length) {
                let promises = [];
                console.log(sqlArrayTrees[url_current_node], 'дети для ', url_current_node);
                for (let key in sqlArrayTrees[url_current_node]) {
                    promises.push(getChildren(key));
                    // выходим если ссылки на ads не обнаружены
                }
                return Promise.all(promises);
            }
        }
    ).then(() => {
        return sqlArrayTrees;
    })
}

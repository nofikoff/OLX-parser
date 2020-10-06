const cheerio = require('cheerio');
const axios = require('axios');


/** пример sqlArrayTrees
 * [
 'https://www.olx.ua/zhivotnye/ivano-frankovsk/': {
    chldr: [
      'https://www.olx.ua/zhivotnye/besplatno-zhivotnye-i-vyazka/ivano-frankovsk/': 'Бесплатно (животные и вязка)',
      'https://www.olx.ua/zhivotnye/sobaki/ivano-frankovsk/': 'Собаки',
      'https://www.olx.ua/zhivotnye/koshki/ivano-frankovsk/': 'Кошки',
      'https://www.olx.ua/zhivotnye/akvariumnye-rybki/ivano-frankovsk/': 'Аквариумистика',
      'https://www.olx.ua/zhivotnye/ptitsy/ivano-frankovsk/': 'Птицы',
      'https://www.olx.ua/zhivotnye/gryzuny/ivano-frankovsk/': 'Грызуны',
      'https://www.olx.ua/zhivotnye/selskohozyaystvennye-zhivotnye/ivano-frankovsk/': 'Сельхоз животные',
      'https://www.olx.ua/zhivotnye/reptilii/ivano-frankovsk/': 'Рептилии',
      'https://www.olx.ua/zhivotnye/drugie-zhivotnye/ivano-frankovsk/': 'Другие животные',
      'https://www.olx.ua/zhivotnye/tovary-dlya-zhivotnyh/ivano-frankovsk/': 'Зоотовары',
      'https://www.olx.ua/zhivotnye/vyazka/ivano-frankovsk/': 'Вязка',
      'https://www.olx.ua/zhivotnye/byuro-nahodok/ivano-frankovsk/': 'Бюро находок'
    ],
    name: 'Продажа домашних животных Ивано-Франковск',
    parent: 'https://www.olx.ua/zhivotnye/'
  },
 'https://www.olx.ua/zhivotnye/byuro-nahodok/ivano-frankovsk/': {
    chldr: [],
    name: 'Объявления о потерянных животных, документах, вещах Ивано-Франковск.',
    parent: 'https://www.olx.ua/zhivotnye/ivano-frankovsk/'
  },
 'https://www.olx.ua/zhivotnye/besplatno-zhivotnye-i-vyazka/ivano-frankovsk/': {
    chldr: [],
    name: 'Животные даром и бесплатная вязка Ивано-Франковск',
    parent: 'https://www.olx.ua/zhivotnye/ivano-frankovsk/'
  },
 'https://www.olx.ua/zhivotnye/vyazka/ivano-frankovsk/': {
    chldr: [],
    name: 'Вязка животных Ивано-Франковск',
    parent: 'https://www.olx.ua/zhivotnye/ivano-frankovsk/'
  },
 'https://www.olx.ua/zhivotnye/akvariumnye-rybki/ivano-frankovsk/': {
    chldr: [],
    name: 'Продажа рыбок Ивано-Франковск',
    parent: 'https://www.olx.ua/zhivotnye/ivano-frankovsk/'
  },
 'https://www.olx.ua/zhivotnye/selskohozyaystvennye-zhivotnye/ivano-frankovsk/': {
    chldr: [],
    name: 'Продажа сельскохозяйственных животных Ивано-Франковск - ',
    parent: 'https://www.olx.ua/zhivotnye/ivano-frankovsk/'
  },
 */

let sqlArrayTrees = [];
// основноый вызов

getChildren('https://www.olx.ua/zhitomir/')
//getChildren('https://www.olx.ua/transport/legkovye-avtomobili/')
    .then((xxx) => {
        console.log("ПИШЕМ В БД2\n", xxx);
        const tree2db = require('./treetomssqldb2');
        tree2db.save(xxx);
    })

function getChildren(url_current_node, urlParent = '') {

    return axios.get(url_current_node,
        {
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
                'referer': url_current_node,
                'accept-language': 'en-UA,en;q=0.9,ru-AU;q=0.8,ru;q=0.7,en-US;q=0.6',
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
        sqlArrayTrees[url_current_node] = {
            chldr: [],
            name: $('h1').text(),
            parent: urlParent,
        }


        console.log("УЗЕЛ", url_current_node)
        // выходим - ДЕТЕЙ НЕТ
        if ($('a.topLink').length === 0) {
            console.log("Страницу узла вижу, но детей нет")

        } else {

            $('div#topLink a.topLink').each((idx, elem) => {
                let urlChildren = $(elem).attr('href');
                let title = $(elem).find('span.link').text();
                // если не пустой заголовок
                if (typeof title === 'string') {
                    sqlArrayTrees[url_current_node].chldr[urlChildren] = title;
                }
            })
        }

    })
        .then(
            () => {
                // еси надо нырнуть глбуже
                if (Object.keys(sqlArrayTrees[url_current_node].chldr).length) {
                    let promises = [];
                    // рекурсия
                    for (let url_children in sqlArrayTrees[url_current_node].chldr) {
                        promises.push(getChildren(url_children, url_current_node));
                    }
                    return Promise.all(promises);
                }
            }
        ).then(() => {
            return sqlArrayTrees;
        })
}

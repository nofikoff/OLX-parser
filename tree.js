const cheerio = require('cheerio');
const axios = require('axios');
// локальный модуль не Node-Modules


// вектор всех веток толькос  прямыми потомками
// вектор всех веток толькос  прямыми потомками
// вектор всех веток толькос  прямыми потомками
// это не мультилевел обект - линей
// это не мультилевел обект - линей
let sqlArrayTrees = [];

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

// основноый вызов


//getChildren('https://www.olx.ua/ko/')
//    getChildren('https://www.olx.ua/hobbi-otdyh-i-sport/sport-otdyh/turizm/')
//getChildren('https://www.olx.ua/zhitomir/')
    //getChildren('https://fgeegegege5g.ua/')
 getChildren('https://www.olx.ua/nedvizhimost/posutochno-pochasovo/zhitomir/')
    //getChildren('https://www.olx.ua/zapchasti-dlya-transporta/')
    .then((xxx) => {
        //console.log(xxx);
        const tree2db = require('./treetodb2');
        tree2db.save(xxx);
    })


// const tree2db = require('./treetodb2');
// tree2db.save();



// РЕКУРСИНВАЯ ФУНКЦИЯ пробегает по всему дому OLX
// РЕКУРСИНВАЯ ФУНКЦИЯ пробегает по всему дому OLX
// РЕКУРСИНВАЯ ФУНКЦИЯ пробегает по всему дому OLX
//url - исследуемая категория
//urlParent
function getChildren(url, urlParent = '') {

    return axios.get(url,
        {
            // не поддерживаме редирект ловим 301 code и пустую страницу ловим
            // не поддерживаме редирект ловим 301 code и пустую страницу ловим
            //maxRedirects: 0,

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
        // читаем контент страницы чистим пробелы и спецзнаки
        // читаем контент страницы чистим пробелы и спецзнаки
        .then(
            (content) => {
                //console.log("прочитал", url)

                return cheerio.load(
                    content.data
                        .replace(/[\r\n\t]+/g, ' ')
                        .replace(/ +(?= )/g, '')
                        .trim()
                );
            }
        )
        .catch(error => {
            console.log('ДАННЫХ НЕТ axios вернул ошибку ' + url + error);
            // пустой контент передаем дальше
            return '';
        })

        // ищем детей или сохраняем в массви без детей
        .then(($) => {

            if (!$) {
                return Promise.reject('Страница не существует или сервер упал / пустой ответ');
            }
            // вектор всех веток толькос  прямыми потомками
            // это не мультилевел обект - линей
            //заготовка она же для кегорий без детей

            sqlArrayTrees[url] =
                {
                    chldr: [],
                    name: $('h1').text(),
                    parent: urlParent,
                };


            //парсим выходим - ДЕТЕЙ НЕТ
            if ($('a.topLink').length === 0) return;


            // каждого ребенка загоняем в массив
            $('div#topLink a.topLink').each((idx, elem) => {
                let urlChildren = $(elem).attr('href');
                let title = $(elem).find('span.link').text();
                // если не пустой аголовок пишем ребенка в очередь для этого родиле я в вектор веток по ключу родителя
                if (typeof title === 'string') {
                    sqlArrayTrees[url].chldr[urlChildren] = title;
                    //sqlArrayTrees[url].parent = url;

                    console.log(url, "ребенок родителя", urlChildren, title);

                    //console.log(sqlArrayTrees[url].chldr[link]);
                }
            })
            //console.log([...new Set(sqlArrayTrees[url].chldr)], "!!!!!!!!!");
            // следующая ветка - переберем полученных деток текущего папы
            //return;
        })

        // детей нет
        // .catch(error => {
        //     //console.log('Детей нет');
        //     return 0;
        // })

        .catch(error => {
            console.log('ДАННЫХ НЕТ axios вернул ошибку ' + url + error);
            // пустой контент передаем дальше
            return '';
        })
        .then(
            // если дети получены для данной ветки url
            // если дети получены для данной ветки url
            // если дети получены для данной ветки url
            // если дети получены для данной ветки url
            () => {

                //if (nextPageFlag) {
                let promises = [];
                // были джубли берем уникальные
                //let childrens= [...new Set(sqlArrayTrees[url].chldr)];
                if (typeof sqlArrayTrees[url] !== 'undefined' && typeof sqlArrayTrees[url].chldr !== 'undefined')
                    for (let key in sqlArrayTrees[url].chldr) {
                        //console.log(key);
                        //console.log("\n создем промис  " + key);
                        /** РЕКУРСИЯ !!!!!
                         // РЕКУРСИЯ !!!!!
                         // РЕКУРСИЯ !!!!! **/
                        promises.push(getChildren(key, url));
                        // выходим если ссылки на ads не обнаружены
                    }
                return Promise.all(promises)
                // таймаут после только если есть дети
                // таймаут после только если есть дети
                // .then((id) => new Promise(resolve => setTimeout(() => {
                //     //console.log("ЖДЕМ ЖДЕМ ЖДЕМ")
                //     resolve(id)
                // }, 2000)));
                //}
            }
        )

        .then(() => {
            return sqlArrayTrees;
        })


}



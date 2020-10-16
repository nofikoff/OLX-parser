/**
 * Подключим библиотеку puppeteer.
 */
const cheerio = require('cheerio');
const axios = require('axios');


/**
 * В функции main размещаем код, который
 * будет использован в ходе веб-скрапинга.
 * Причина, по который мы создаём асинхронную функцию,
 * заключаемся в том, что мы хотим воспользоваться асинхронными
 * возможностями puppeteer.
 */
async function getAds(url) {


    // ключ для обьявления
    let myRegexp = /-ID([^-.]*)\.html$/g;
    let match = myRegexp.exec(url);
    let URLFROMID = match[1];

    let PHPSESSIONID = '';
    let text = {};
    /**
     * Для получения телефона необходимо сделать запрос с живым коректным SESSIONID
     * Для получения телефона необходимо сделать запрос с живым коректным SESSIONID
     * Для получения телефона необходимо сделать запрос с живым коректным SESSIONID
     */

    return axios.get(url,
        {
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

        .then((content) => {
            /**
             * ловим живую SESSIONID
             */
            PHPSESSIONID = parseCookiesPHPSessionValue(content.headers['set-cookie']);
            //
            return cheerio.load(
                content.data
                    .replace(/[\r\n\t]+/g, ' ')
                    .replace(/ +(?= )/g, '')
                    .trim()
            );
        })
        .then(($) => {
                /**
                 * ПАРСИМ СТРАНИЦУ ОБЬЯВЛЕНИЯ
                 */

                text.url = url;
                text.title = $('h1').text().trim();
                text.address = $('address').text().trim();
                // убираем лишние не цифры в цене побелы и пр
                text.price = $('.pricelabel__value').text().replace(/\D+/g, '');
                text.desc = $('#textContent').text().trim();

                text.images = [];
                $('ul#descGallery > li > a').each((idx, elem) => {
                    let title = $(elem).attr('href');
                    // пушим в массив
                    text.images.push(title);
                })

                text.urlCategory = [];

                $('table#breadcrumbTop').find('a').each(function (index, element) {

                    //console.log("url category = ", $(element).attr('href'));
                    //console.log($(element).find('.offer-details__value').text())
                    let urlcategory = $(element).attr('href');
                    if (urlcategory.indexOf("/list/") === -1) {
                        text.urlCategory = urlcategory;
                    }


                });

                text.bottombar = [];

                // pars Ad number

                var ad_num = text.AD_NUMBER = $('.offer-bottombar__items > li > strong').text().trim();
                console.log(ad_num);


                // data
                var str = $('.offer-bottombar__item > em > strong').text().trim();
                console.log(str);

                // var str = 'в 14:12, 27 февраля 2020';

                const moment = require('moment');

                // перед тем как пользоваться нужно установить - npm i moment
                // and write const moment = require('moment');
                //https://momentjs.com/docs/#/i18n/
                moment.locale('ru');
                // console.log(moment.months(moment));
                let p = str.substring(12, 20);


                // выводит месяц
                //  console.log(moment().set('month', p));
                //  console.log(moment().get('month'));

                var a = moment().set('month', p);
                //console.log(a.month()+1); 
                console.log(moment([str.substring(str.length - 4), a.month(), str.substring(9, 11)]).format("YYYY-MM-DD"));
                console.log(str.substring(2, 7));
                text.Dat = moment([str.substring(str.length - 4), a.month(), str.substring(9, 11)]).format("YYYY-MM-DD") + " " + str.substring(2, 7);


                text.categoryUrl = '';
                $('#breadcrumbTop').find('a').each((idx, elem) => {
                    let title = $(elem).attr('href');

                    if (title.indexOf("/list/") === -1) text.categoryUrl = title;


                })


                text.hashTags = [];
                $('ul.offer-details').find('li').each(function (index, element) {

                    // console.log($(element).find('.offer-details__name').text())
                    // console.log($(element).find('.offer-details__value').text())

                    if ($(element).find('.offer-details__value--multiple').length > 0) {
                        $(element).find('.offer-details__value').find('a').each(function (index2, element2) {
                                let val = $(element2).text().toLowerCase();
                                // нулевые пропускаем
                                if (val !== '') {
                                    // text.hashTags.push([
                                    //     $(element).find('.offer-details__name').text().toLowerCase(),
                                    //     val
                                    // ]);

                                    // если данных внутри этой горуппы тегов нет
                                    // то инициализируем как пустой масив чтобы дальше ПУШИТЬ
                                    if (typeof text.hashTags[$(element).find('.offer-details__name').text().toLowerCase()] !== "object")
                                        text.hashTags[$(element).find('.offer-details__name').text().toLowerCase()] = [];

                                    text.hashTags[$(element).find('.offer-details__name').text().toLowerCase()].push(val);
                                }

                            }
                        )
                    } else {
                        let val = $(element).find('.offer-details__value').text().toLowerCase();
                        // нулевые пропускаем
                        if (val !== '')

                            // text.hashTags.push([
                            //     $(element).find('.offer-details__name').text().toLowerCase(),
                            //     val
                            // ]);


                            text.hashTags[$(element).find('.offer-details__name').text().toLowerCase()] = [];
                            text.hashTags[$(element).find('.offer-details__name').text().toLowerCase()].push(val);


                    }
                });


            }
        )
        // ВТОРОЙ ЗАПРОС - получаем ключ pt 00 в контенте ВАЖНО ПРИ ЭТОМ УКАЗАТЬ СЕССИЮ !!!
        // ВТОРОЙ ЗАПРОС - получаем ключ pt 00 в контенте ВАЖНО ПРИ ЭТОМ УКАЗАТЬ СЕССИЮ !!!
        // ВТОРОЙ ЗАПРОС - получаем ключ pt 00 в контенте ВАЖНО ПРИ ЭТОМ УКАЗАТЬ СЕССИЮ !!!
        .then(
            function (content) {
                //console.log(content.headers['set-cookie'], "все куки от сервера перед шаг 002");
                //PHPSESSIONID = parseCookiesPHPSessionValue(content.headers['set-cookie']);

                return axios.get(url,
                    {
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
                            'cookie': 'PHPSESSID=' + PHPSESSIONID

                        }
                    }
                )
            })


        //API запрос телефона с учетом сесии и ключа а HTML
        //API запрос телефона с учетом сесии и ключа а HTML
        //API запрос телефона с учетом сесии и ключа а HTML
        .then(
            function (content) {
                //console.log(content.headers['set-cookie'], "все куки от сервера перед шаг 003");
                const myRegexp = /var phoneToken = '([^']+)'/g;
                let match = myRegexp.exec(content.data);
                let ptFromhtml = match[1];
                //console.log(" PT HTML ", ptFromhtml);
                //console.log(" PHPSESSIONID ", PHPSESSIONID);


                return axios.get('https://www.olx.ua/ajax/misc/contact/phone/' + URLFROMID + '/?pt=' + ptFromhtml,
                    {
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
                            'referer': 'https://www.olx.ua/obyavlenie/sapogi-IDJ5zep.html',
                            'accept-language': 'en-UA,en;q=0.9,ru-AU;q=0.8,ru;q=0.7,en-US;q=0.6',
                            //'cookie': 'PHPSESSID=psb0hg31nq2ceekba3cunsm847'
                            'cookie': 'PHPSESSID=' + PHPSESSIONID
                        }
                    }
                )


            }
        )
        .then((content) => {
            //console.log(content.headers['set-cookie'], "все куки от сервера перед шаг 004");
            //console.log(content.data);
            text.phone = content.data.value;
            //console.log(text)
            return text;
        })


// доставем временный ключ
// var phoneToken = 'dee489203d34b0b1b10ca3299ab28ed82dcb92f94f0680175724466a40e0b89bfa6aee19dd8bdfbddb2694d9aa0f7d2c1d5adcb3aa214fc586051f2d3b46892d';
// IDJ0jDy ID объявления вутри кнопки https://www.olx.ua/obyavlenie/sdam-2-kom-v-tsentre-goroda-IDJ0jDy.html


}

/**
 * Запускаем скрипт, вызвав main().
 */
getAds('https://www.olx.ua/obyavlenie/kvartira-posutochno-odnokomnatnaya-s-evroremontom-v-tsentre-goroda-IDDr3Q7.html').then((xxx) => {
    console.log("объявление спарсили и вот что получилось:\n", xxx);
    //тут надо візвать сохранение в БД
    //const tree2db = require('./treetomssqldb2');
    //tree2db.save(xxx);
})


//парсим ключ из кукисов, чтобы использовать в сессии парсинга телефона
function parseCookiesPHPSessionValue(response) {

    let result;
    response.forEach((entry) => {
        let parts001 = entry.split(';');
        let parts002 = parts001[0].split('=');
        if (parts002[0] === 'PHPSESSID') {
            result = parts002[1];
        }
    });
    return result;
}




const cheerio = require('cheerio');
const axios = require('axios');
let mysql = require('mysql');

let text = {};

//module.exports = 
function getAds(url) {

    // ключ для обьявления
    let myRegexp = /-ID([^-.]*)\.html$/g;
    let match = myRegexp.exec(url);
    let URLFROMID = match[1];
    let PHPSESSIONID = '';
    /**
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

                text.hashTags = [];
                $('ul.offer-details').find('li').each(function (index, element) {
                    // console.log($(element).find('.offer-details__name').text())
                    // console.log($(element).find('.offer-details__value').text())
                    if ($(element).find('.offer-details__value--multiple').length > 0) {
                        $(element).find('.offer-details__value').find('a').each(function (index2, element2) {
                                let val = $(element2).text().toLowerCase();
                                // нулевые пропускаем
                                if (val !== '')
                                    text.hashTags.push([
                                        $(element)
                                            .find('.offer-details__name')
                                            .text().toLowerCase(),
                                        val
                                    ]);
                            }
                        )
                    } else {
                        let val = $(element).find('.offer-details__value').text().toLowerCase();
                        // нулевые пропускаем
                        if (val !== '')
                            text.hashTags.push([
                                $(element).find('.offer-details__name').text().toLowerCase(),
                                val
                            ]);
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
            let str = (content.data.value);
            text.phone = str.match("block\">(.*?)<\/span")[1];
            console.log(text);
            return text;
        })

// доставем временный ключ
// var phoneToken = 'dee489203d34b0b1b10ca3299ab28ed82dcb92f94f0680175724466a40e0b89bfa6aee19dd8bdfbddb2694d9aa0f7d2c1d5adcb3aa214fc586051f2d3b46892d';
// IDJ0jDy ID объявления вутри кнопки https://www.olx.ua/obyavlenie/sdam-2-kom-v-tsentre-goroda-IDJ0jDy.html
}

let con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: ""
});

(async () => {
    text = await getAds('https://www.olx.ua/obyavlenie/sdam-2-komnatnuyu-kvartiru-na-bogunii-s-tehnikoy-IDIL6tA.html');
    let sql = "INSERT INTO `olx`.`ads` (`id`, `name`, `adress`, `price`, `description`, `images`, `date`, `status`, `url`) VALUES (NULL,  '"+ 
        text.title +"',    '" + text.address + "', "+ text.price +", '"+ text.desc +"', '"+ text.images+"', NOW(), '1', '"+ text.url+"')";
        con.connect(function(err) {
            if (err) throw err;
            console.log("Connected!");
            con.query(sql, function (err, result) {
            if (err) throw err;
            console.log("Result: " + result);
            });
        });
    })();
  //console.log(text);

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


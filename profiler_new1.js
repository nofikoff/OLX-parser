/**
 * Подключим библиотеку puppeteer.
 */
const cheerio = require('cheerio');
const axios = require('axios');
const moment = require('moment');

// let mysql = require("mysql");
let sql;
let sqlArrayTrees;
// let connection = mysql.createConnection({
//     host: "stas.pogonyalo.com",
//     user: "olx2",
//     database: 'olx',
//     password: "y2jC2wBSlfi0YeCP"
// });


// сокращения url
var url_oll = "https://www.olx.ua/obyavlenie/otdyh-v-zakarpate-s-polyana-dom-faina-arenda-IDEozJb.html#0ee762f604";
//var url_oll ="https://www.olx.ua/obyavlenie/shikarniy-budinok-na-mar-yanvts-IDJsiCT.html#66e75f278a";
//var url_oll ="https://www.olx.ua/obyavlenie/prodam-vito-v-horoshem-sostoyanii-IDJulqi.html#14cad6dd38";
//var url_oll ="https://www.olx.ua/obyavlenie/kurtka-puhovik-novaya-zimnyaya-fila-puma-IDFwPTL.html?sd=1#2d12d0e86b";
var withoutLastChunk = url_oll.slice(0, url_oll.lastIndexOf("html"));
let may_url =  withoutLastChunk + "html"

getAds(may_url)
.then((xxx) => {
    console.log("ура ",xxx);
    const tree2db = require('./profiltodb');
   return  tree2db.save(xxx);
     //tree2db.save(xxx);
})
.then(
    (ID)=>{
        console.log("АДРЕЙ ЛОВИ НАШ ПРОФАЙЛ _ID ", ID);
        
    }
)

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
                 * ищим url profaila
                 */

                text.url = url;
                console.log("hlop - hlop - hlop - hlop - hlop - hlop - hlop - hlop - hlop - hlop - hlop - hlop");
                text.address = $('address').text().trim();

                // profail 
                text.profUrl = $('.offer-user__actions').text().trim();



                Prof_name = text.Prof_name = $('.offer-user__actions> h4 > a').text().trim();
                Prof_url = text.URl = $('.offer-user__actions > h4 > a').attr('href');




                // data
                var str = text.Dat = $('.offer-bottombar__item > em > strong').text().trim();
                console.log("date = " + str);





               // var str = 'в 14:12, 27 февраля 2020';

                const moment = require('moment');

                                // перед тем как пользоваться нужно установить - npm i moment 
                                // and write const moment = require('moment');
                                //https://momentjs.com/docs/#/i18n/
                moment.locale('ru'); 
                // console.log(moment.months(moment));
                let p = str.substring(12,20);  
                            

                // выводит месяц
                //  console.log(moment().set('month', p));
                //  console.log(moment().get('month'));
                
                var a = moment().set('month', p);
                //console.log(a.month()+1); 
                console.log(moment([str.substring(str.length - 4), a.month(), str.substring(9,11) ]).format("YYYY-MM-DD"));
                console.log(str.substring(2,7));






                // day create profile

                var dt_pr = text.Dat_prof = $('.user-since').text().trim();
               // console.log(dt_pr);
                moment.locale('ru');
                
                let q = dt_pr.substring(9,13); 
                console.log(q);
                
                var x = moment().set('month', q);
                console.log(x); 
                
                //console.log("Reg_date = " + moment([dt_pr.substring(dt_pr.length - 4), x.month()]).format("YYYY-MM-DD"));
                Reg_date =  moment([dt_pr.substring(dt_pr.length - 4), x.month()]).format("YYYY-MM-DD")


                // pars Ad number
                
                var ad_num = text.AD_NUMBER = $('.offer-bottombar__items > li > strong').text().trim();
                console.log(ad_num);


                






               
            }
            
        )

      
   
        // ВТОРОЙ ЗАПРОС - получаем ключ pt 00 в контенте ВАЖНО ПРИ ЭТОМ УКАЗАТЬ СЕССИЮ !!!
        // ВТОРОЙ ЗАПРОС - получаем ключ pt 00 в контенте ВАЖНО ПРИ ЭТОМ УКАЗАТЬ СЕССИЮ !!!
        // ВТОРОЙ ЗАПРОС - получаем ключ pt 00 в контенте ВАЖНО ПРИ ЭТОМ УКАЗАТЬ СЕССИЮ !!!
        .then(
            function () {
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
            console.log(content.data);
            text.phone = content.data.value;

            return text;            
            
        })


// доставем временный ключ
// var phoneToken = 'dee489203d34b0b1b10ca3299ab28ed82dcb92f94f0680175724466a40e0b89bfa6aee19dd8bdfbddb2694d9aa0f7d2c1d5adcb3aa214fc586051f2d3b46892d';
// IDJ0jDy ID объявления вутри кнопки https://www.olx.ua/obyavlenie/sdam-2-kom-v-tsentre-goroda-IDJ0jDy.html


}

/**
 * Запускаем скрипт, вызвав main().
 */
//getAds('https://vlad75dzhazovki.olx.ua/obyavlenie/losiny-dlya-gimnastiki-chernye-s-vyrezom-pod-pyatku-i-s-setochkoy-vstavkoy-IDJbfAU.html');
//getAds('https://www.olx.ua/obyavlenie/kvartira-posutochno-odnokomnatnaya-s-evroremontom-v-tsentre-goroda-IDDr3Q7.html');

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


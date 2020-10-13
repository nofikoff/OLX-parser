const Sentry = require("@sentry/node");
Sentry.init({
    dsn: "https://634a2987e92946f4a463106ee390ab4d@o211073.ingest.sentry.io/5462166",
    // We recommend adjusting this value in production, or using tracesSampler
    // for finer control
    //tracesSampleRate: 1.0,
});


var string = '"<span class="block">+063 21 75 947</span> <span class="block">+380-6-7-5-0-20151</span> <span class="block">+38(095)643-8-787</span>';
matches=string.replace(/\s|\(|\)|-/g, '').matchAll(/0\d{9}/g);
for (const match of matches) {
    console.log(match[0]);
}


try {
    foo();

} catch (e) {
    Sentry.captureException(e);
}
// finally {
//     transaction.finish();
// }


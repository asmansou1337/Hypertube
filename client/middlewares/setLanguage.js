
/**
* Takes Lang value from cookie and sets it to contextService 
example: console.log(contextService.get('user:locale')) => { lang: en }
*/
const setLanguage = async (req, res, next) => {
    let cookies = {}
    const rc = req.headers.cookie;
    if(rc)
        rc && rc.split(';').forEach(( cookie ) => {
            let parts = cookie.split('=');
            cookies[parts.shift().trim()] = decodeURI(parts.join('='));
    });

    // (cookies.lang && cookies.lang === 'fr') ? httpContext.set('lang', 'fr') : httpContext.set('lang', 'en')
    process.env['lang'] = (cookies.lang && cookies.lang === 'fr') ? 'fr' :  'en';
    next();
}

module.exports = setLanguage
var contextService = require('request-context')

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
    (cookies.Lang && cookies.Lang === 'fr') ? contextService.set('user:locale.lang', 'fr') : contextService.set('user:locale.lang', 'en')
    next();
}

module.exports = setLanguage
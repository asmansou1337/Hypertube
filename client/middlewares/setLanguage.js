
/**
* Takes Lang value from cookie and sets it to a environment variable
*/
const setLanguage = async (req, res, next) => {
    let cookies = {}
    const rc = req.headers.cookie;
    if(rc)
        rc && rc.split(';').forEach(( cookie ) => {
            let parts = cookie.split('=');
            cookies[parts.shift().trim()] = decodeURI(parts.join('='));
    });

    process.env['lang'] = (cookies.lang && cookies.lang === 'fr') ? 'fr' :  'en';
    next();
}

module.exports = setLanguage
const locales = require('../locales/locales')

/**
     * loads locals Language object depending on the data provided by env
     * get user language from 'user' context set by setLanguage middleware
     * @return Dictionary Language object
     */
module.exports = UserDictionary = () => {    
    let USER_LANG =  process.env['lang']
    let Dictionary = (USER_LANG == 'fr') ? locales.fr : locales.en 
    return  Dictionary
}
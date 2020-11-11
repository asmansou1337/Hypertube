// get cookie by name 
function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

// function to execute when the window is loaded
function preloadFunc() {
    var lang = getCookie('lang');
    
    if (!lang || (lang !== 'en' && lang !== 'fr')) 
        lang = 'en'

    // $(this).text(arrLang[lang]['email']);
    $('.lang').each(function (index, element) {
            $(this).text(arrLang[lang][$(this).attr('key')]);
        });
    
    // for the placeholder search in navbar
    if (lang == 'fr') {
        if(document.getElementsByName('search')[0] != undefined && document.getElementsByName('search')[0] !=''){
        document.getElementsByName('search')[0].placeholder='Chercher';

    }
    // for the placeholder write comment in player page
    if (lang == 'fr') {
        if(document.getElementsByName('comment')[0] != undefined && document.getElementsByName('comment')[0] !=''){
        document.getElementsByName('comment')[0].placeholder='Donnez Votre Avis...';

    }}
    }
}

window.onload = preloadFunc();


// when the link english or french is clicked
// page login
$(function () {
    $('.translate').click(function () {
        var lang = $(this).attr('id');
        if (!lang || (lang !== 'en' && lang !== 'fr')) 
            lang = 'en'
        document.cookie = "lang=" + lang + "; path=/";
        $('.lang').each(function (index, element) {
            $(this).text(arrLang[lang][$(this).attr('key')]);
        });
    });
})

function select() {
    if(document.querySelector('#profile'))
    document.querySelector('#profile').click();
}

function displayProfile(e) {
    if (e.files[0]) {
        if (fileExtValidate(e.files[0].name)) {
            if (fileSizeValidate(e.files[0])) {
                var reader = new FileReader();

                reader.onload = function (e) {
                    if(document.querySelector('#pictureProfile'))
                    document.querySelector('#pictureProfile').style.backgroundImage = 'url(' + e.target.result + ')';
                }
                reader.readAsDataURL(e.files[0]);
            }
        }
    }
}


// function for  validate file extension
var validExt = ".jpeg, .jpg";
function fileExtValidate(fdata) {
    var filePath = fdata;
    var getFileExt = filePath.substring(filePath.lastIndexOf('.') + 1).toLowerCase();
    var pos = validExt.indexOf(getFileExt);
    if (pos < 0) {
        return false;
    } else {
        return true;
    }
}
//function for validate file size 
var maxSize = '10';
function fileSizeValidate(fdata) {
    if (fdata) {
        var fsizek = fdata.size / 1024;
        var fsizem = fsizek / 1024;
        if (fsizem >= maxSize) {
            return false;
        }
        else if (fsizek < 1.2) {
            return false;
        }
        else {
            return true;
        }
    }
}

setTimeout(function(){
    if ($('#errors').length > 0) {
        $('#errors').remove();
     }
     if ($('#result').length > 0) {
        $('#result').remove();
     }
    }, 5000)

$(document).ready(function() {
        $('.mdb-select').materialSelect();
        });
/**
 * Created with JetBrains WebStorm.
 * User: dtudury
 * Date: 4/27/13
 * Time: 1:14 AM
 * To change this template use File | Settings | File Templates.
 */

importScripts('cryptoped.js');
onmessage = function(e) {
    var v = JSON.parse(e.data);
    var t0 = (new Date()).getTime();
    var hash = cryptoped1(v.P, v.S, v.c, v.dkLen);
    var t1 = (new Date()).getTime();
    var pass = hash == v.DK;
    var result = {
        hash:hash,
        pass:pass,
        dt:t1-t0
    }
    postMessage(JSON.stringify(result));
}

function cryptoped1(password, salt, iterations, keyLength) {
    var wordArray = cryptoped.pbkdf2(password, salt, iterations, keyLength, cryptoped.sha1);
    var string = cryptoped.wordsToHexString(wordArray);
    return string.substr(0, keyLength * 2);
}

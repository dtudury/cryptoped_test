/**
 * Created with JetBrains WebStorm.
 * User: dtudury
 * Date: 4/28/13
 * Time: 1:56 AM
 * To change this template use File | Settings | File Templates.
 */

importScripts('sha-lite.js');
onmessage = function(e) {
    var v = JSON.parse(e.data);
    var t0 = (new Date()).getTime();
    var hash = shalite(v.P, v.S, v.c, v.dkLen);
    var t1 = (new Date()).getTime();
    var pass = hash == v.DK;
    var result = {
        hash:hash,
        pass:pass,
        dt:t1-t0
    }
    postMessage(JSON.stringify(result));
}

function shalite(password, salt, iterations, keyLength) {
    return password.pbkdf2(salt, iterations, keyLength);
//    var wordArray = cryptoped.pbkdf2(password, salt, iterations, keyLength, cryptoped.sha1);
//    var string = cryptoped.wordsToHexString(wordArray);
//    return string.substr(0, keyLength * 2);
}
/**
 * Created with JetBrains WebStorm.
 * User: dtudury
 * Date: 4/27/13
 * Time: 1:39 AM
 * To change this template use File | Settings | File Templates.
 */


importScripts('http://crypto-js.googlecode.com/svn/tags/3.1.2/build/components/core.js');
importScripts('http://crypto-js.googlecode.com/svn/tags/3.1.2/build/components/sha256.js');
importScripts('http://crypto-js.googlecode.com/svn/tags/3.1.2/build/components/sha1.js');
importScripts('http://crypto-js.googlecode.com/svn/tags/3.1.2/build/components/hmac.js');
importScripts('http://crypto-js.googlecode.com/svn/tags/3.1.2/build/components/pbkdf2.js');

onmessage = function(e) {
    var v = JSON.parse(e.data);
    var t0 = (new Date()).getTime();
    var hash = cryptoJs1(v.P, v.S, v.c, v.dkLen);
    var t1 = (new Date()).getTime();
    var pass = hash == v.DK;
    var result = {
        hash:hash,
        pass:pass,
        dt:t1-t0
    }
    postMessage(JSON.stringify(result));
}


function cryptoJs1(password, salt, iterations, keyLength) {
    var keySize = 128 / 32;
    if (keyLength > 32) {
        keySize = 512 / 32;
    } else if (keyLength > 16) {
        keySize = 256 / 32;
    }
    var key256Bits = CryptoJS.PBKDF2(password, salt, { keySize: keySize, iterations: iterations});
    return key256Bits.toString(CryptoJS.enc.Hex).substr(0, keyLength * 2);
}
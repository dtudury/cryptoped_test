var http = require("http");
var fs = require("fs");
var crypto = require("crypto");
var cryptoped = require("cryptoped");

var _index = fs.readFileSync("./web/simpleTimeTest.html");
var js = {
    "/simpleTimeTest.js": fs.readFileSync("./web/simpleTimeTest.js"),
    "/cryptoped.js": fs.readFileSync("./node_modules/cryptoped/cryptoped.js"),
    "/cryptopedWorker1.js": fs.readFileSync("./web/cryptopedWorker1.js"),
    "/shaliteWorker1.js": fs.readFileSync("./web/shaliteWorker1.js"),
    "/cryptojsWorker1.js": fs.readFileSync("./web/cryptojsWorker1.js"),
    "/cryptopedWorker2.js": fs.readFileSync("./web/cryptopedWorker2.js"),
    "/cryptojsWorker2.js": fs.readFileSync("./web/cryptojsWorker2.js"),
    "/sha-lite.js": fs.readFileSync("./node_modules/sha-lite/sha-lite.js")
};


function startup() {
    http.createServer(function (request, response) {
        var data = "";
        request.on("data", function (dataChunk) {
            data += dataChunk;
            if (data.length > 1e6) {
                data = "";
                response.writeHead(413, {"Content-Type": "text/plain"});
                request.connection.destroy();
            }
        });
        request.on("end", function () {
            var path_queryString = request.url.split("?");
            var path = path_queryString[0];
            var queryString = path_queryString[1];
            var name = path.split(".");
            var extension = name.pop();
            if (path == "/" || path == "/index.html")
                serveCached(response, _index, "text/html");
            else if (path == "/channel.html")
                serveCached(response, _channel, "text/html");
            else if (js[path])
                serveCached(response, js[path], "application/x-javascript");
            else serve404(response);
        });
    }).listen(8000);
}
function serveCached(response, content, contentType) {
    response.writeHead(200, {"Content-Type": contentType});
    response.end(content);
}
function serve404(response) {
    response.writeHead(404);
    response.end();
}

_index = _index.toString();
var t0;

t0 = (new Date()).getTime();
crypto.pbkdf2("password", "salt", 10000, 20, function (err, derivedKey) {
    var dt1 = (new Date()).getTime() - t0;
    t0 = (new Date()).getTime();
    var hash = cryptoped.pbkdf2("password", "salt", 10000, 20, cryptoped.sha1);
    var dt0 = (new Date()).getTime() - t0;
    var timesSlower = dt0 / dt1;
    var serverTest = timesSlower.toFixed();
    _index = _index.replace("%SERVER_TEST%", serverTest);
    startup();
});
